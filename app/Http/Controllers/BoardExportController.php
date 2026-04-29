<?php

namespace App\Http\Controllers;

use App\Models\Board;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

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

        $filename = "whhid-board-{$board->slug}-" . now()->format('Y-m-d') . '.json';

        return response(json_encode($export, JSON_PRETTY_PRINT))
            ->header('Content-Type', 'application/json')
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }
}
