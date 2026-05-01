<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

class BoardExportController extends Controller
{
    public function download(Request $request, Board $board): Response
    {
        $this->authorize('view', $board);

        $board->load([
            'project',
            'owner',
            'members.user',
            'labels',
            'lists.cards.assignees',
            'lists.cards.labels',
            'lists.cards.comments.user',
            'lists.cards.attachments',
            'lists.cards.checklists.items',
            'lists.cards.githubLink',
            'discordWebhook',
        ]);

        if ($request->query('format') === 'trello') {
            return $this->downloadTrello($board);
        }

        return $this->downloadNative($board);
    }

    private function downloadNative(Board $board): Response
    {
        $export = [
            'export_schema_version' => '1.0',
            'exported_at' => now()->toIso8601String(),
            'board' => [
                'id' => $board->id,
                'name' => $board->name,
                'slug' => $board->slug,
                'description' => $board->description,
                'visibility' => $board->visibility,
                'project' => $board->project ? ['id' => $board->project->id, 'name' => $board->project->name] : null,
                'owner' => ['id' => $board->owner->id, 'name' => $board->owner->name],
                'created_at' => $board->created_at?->toIso8601String(),
            ],
            'labels' => $board->labels->map(fn ($l) => ['id' => $l->id, 'name' => $l->name, 'color' => $l->color]),
            'lists' => $board->lists->map(fn ($list) => [
                'id' => $list->id,
                'name' => $list->name,
                'position' => $list->position,
                'wip_limit' => $list->wip_limit,
                'cards' => $list->cards->map(fn ($card) => [
                    'id' => $card->id,
                    'title' => $card->title,
                    'description' => $card->description,
                    'priority' => $card->priority,
                    'position' => $card->position,
                    'due_at' => $card->due_at?->toIso8601String(),
                    'started_at' => $card->started_at?->toIso8601String(),
                    'completed_at' => $card->completed_at?->toIso8601String(),
                    'assignees' => $card->assignees->map(fn ($u) => ['id' => $u->id, 'name' => $u->name]),
                    'labels' => $card->labels->map(fn ($l) => ['id' => $l->id, 'name' => $l->name]),
                    'comments' => $card->comments->map(fn ($c) => ['user' => $c->user->name, 'body' => $c->body, 'created_at' => $c->created_at?->toIso8601String()]),
                    'checklists' => $card->checklists->map(fn ($cl) => [
                        'name' => $cl->name,
                        'items' => $cl->items->map(fn ($i) => ['name' => $i->name, 'is_completed' => $i->is_completed]),
                    ]),
                    'github_issue' => $card->githubLink ? [
                        'issue_number' => $card->githubLink->issue_number,
                        'issue_url' => $card->githubLink->issue_url,
                        'issue_state' => $card->githubLink->issue_state,
                    ] : null,
                    'source_system' => $card->source_system,
                    'source_card_id' => $card->source_card_id,
                    'created_at' => $card->created_at?->toIso8601String(),
                ]),
            ]),
            'discord' => $board->discordWebhook ? ['enabled' => $board->discordWebhook->enabled] : null,
        ];

        $filename = "whhid-board-{$board->slug}-".now()->format('Y-m-d').'.json';

        return $this->jsonDownload($export, $filename);
    }

    private function downloadTrello(Board $board): Response
    {
        $boardId = 'board-'.$board->id;
        $allCards = $board->lists->flatMap(fn ($list) => $list->cards);

        $checklists = $allCards->flatMap(function ($card) use ($boardId): Collection {
            return $card->checklists->map(fn ($cl) => [
                'id' => 'checklist-'.$cl->id,
                'name' => $cl->name,
                'idCard' => 'card-'.$card->id,
                'idBoard' => $boardId,
                'pos' => $cl->id * 16384,
                'checkItems' => $cl->items->values()->map(fn ($item, $idx) => [
                    'id' => 'item-'.$item->id,
                    'name' => $item->name,
                    'state' => $item->is_completed ? 'complete' : 'incomplete',
                    'pos' => ($idx + 1) * 16384,
                    'idChecklist' => 'checklist-'.$cl->id,
                ])->values()->all(),
            ]);
        });

        $export = [
            'id' => $boardId,
            'name' => $board->name,
            'desc' => $board->description ?? '',
            'closed' => false,
            'url' => '',
            'shortUrl' => '',
            'lists' => $board->lists->values()->map(fn ($list, $idx) => [
                'id' => 'list-'.$list->id,
                'name' => $list->name,
                'closed' => false,
                'pos' => ($idx + 1) * 16384,
                'idBoard' => $boardId,
            ])->values()->all(),
            'cards' => $allCards->values()->map(fn ($card, $idx) => [
                'id' => 'card-'.$card->id,
                'name' => $card->title,
                'desc' => $card->description ?? '',
                'closed' => false,
                'pos' => ($idx + 1) * 16384,
                'idList' => 'list-'.$card->list_id,
                'idBoard' => $boardId,
                'due' => $card->due_at?->toIso8601String(),
                'dueComplete' => $card->completed_at !== null,
                'labels' => $card->labels->map(fn ($l) => [
                    'id' => 'label-'.$l->id,
                    'name' => $l->name,
                    'color' => $this->mapToTrelloColor($l->color),
                    'idBoard' => $boardId,
                ])->values()->all(),
                'idLabels' => $card->labels->map(fn ($l) => 'label-'.$l->id)->values()->all(),
                'idChecklists' => $card->checklists->map(fn ($cl) => 'checklist-'.$cl->id)->values()->all(),
                'idMembers' => [],
            ])->values()->all(),
            'labels' => $board->labels->map(fn ($l) => [
                'id' => 'label-'.$l->id,
                'name' => $l->name,
                'color' => $this->mapToTrelloColor($l->color),
                'idBoard' => $boardId,
            ])->values()->all(),
            'checklists' => $checklists->values()->all(),
            'members' => $board->members->map(fn ($m) => [
                'id' => 'member-'.$m->user->id,
                'fullName' => $m->user->name,
                'username' => str($m->user->name)->lower()->replace(' ', '_')->toString(),
            ])->values()->all(),
            'memberships' => [],
        ];

        $filename = "trello-{$board->slug}-".now()->format('Y-m-d').'.json';

        return $this->jsonDownload($export, $filename);
    }

    private function mapToTrelloColor(string $hex): string
    {
        $map = [
            '#ef4444' => 'red', '#f97316' => 'orange', '#eab308' => 'yellow',
            '#22c55e' => 'green', '#3b82f6' => 'blue', '#8b5cf6' => 'purple',
            '#ec4899' => 'pink', '#06b6d4' => 'sky', '#84cc16' => 'lime',
            '#000000' => 'black',
        ];

        return $map[strtolower($hex)] ?? 'blue';
    }

    /** @param array<mixed> $data */
    private function jsonDownload(array $data, string $filename): Response
    {
        return response(json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))
            ->header('Content-Type', 'application/json')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }
}
