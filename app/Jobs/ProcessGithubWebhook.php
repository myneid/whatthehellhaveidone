<?php

namespace App\Jobs;

use App\Events\CardMoved;
use App\Models\Card;
use App\Models\GithubCardLink;
use App\Models\GithubWebhookEvent;
use App\Services\ActivityLogService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class ProcessGithubWebhook implements ShouldQueue
{
    use Queueable;

    private const COPILOT_AGENT_LOGIN = 'copilot-swe-agent[bot]';

    public function __construct(public readonly GithubWebhookEvent $event) {}

    public function handle(ActivityLogService $activityLog): void
    {
        try {
            match ($this->event->event_type) {
                'issues' => $this->handleIssueEvent($this->event->payload),
                'pull_request' => $this->handlePullRequestEvent($this->event->payload, $activityLog),
                default => null,
            };

            $this->event->update(['processed_at' => now()]);
        } catch (Throwable $e) {
            $this->event->update(['failed_at' => now(), 'failure_reason' => $e->getMessage()]);
            throw $e;
        }
    }

    private function handleIssueEvent(array $payload): void
    {
        $action = $payload['action'] ?? null;
        $issue = $payload['issue'] ?? null;

        if (! $issue || ! $action) {
            return;
        }

        $link = GithubCardLink::query()
            ->where('github_repository_id', '=', $this->event->github_repository_id)
            ->where('issue_number', '=', (int) $issue['number'])
            ->with('card')
            ->first();

        if (! $link || ! $link->card) {
            // No existing card for this issue — import as new card on connected boards if action is 'opened'
            if ($action === 'opened') {
                $this->importNewIssueAsCard($issue);
            }

            return;
        }

        $card = $link->card;
        $updates = [];

        match ($action) {
            'edited' => $updates = array_filter([
                'title' => $issue['title'] !== $card->title ? $issue['title'] : null,
                'description' => ($issue['body'] ?? '') !== ($card->description ?? '') ? ($issue['body'] ?: null) : null,
            ]),
            'closed' => $updates = $card->completed_at ? [] : ['completed_at' => now()],
            'reopened' => $updates = $card->completed_at ? ['completed_at' => null] : [],
            default => null,
        };

        if ($updates) {
            $card->update($updates);
        }

        $link->update([
            'issue_state' => $issue['state'],
            'last_synced_source' => 'github',
            'last_synced_at' => now(),
        ]);
    }

    private function importNewIssueAsCard(array $issue): void
    {
        $boards = $this->event->githubRepository
            ->boards()
            ->with('lists')
            ->get();

        foreach ($boards as $board) {
            $list = $board->lists()->whereNull('archived_at')->orderBy('position')->first();
            if (! $list) {
                continue;
            }

            // Find the board owner to use as card creator
            $creatorId = $board->owner_id;

            $position = Card::query()
                ->where('list_id', '=', $list->id)
                ->where('archived_at', '=', null)
                ->orderByDesc('position')
                ->value('position') ?? 0;

            $card = Card::create([
                'board_id' => $board->id,
                'list_id' => $list->id,
                'creator_id' => $creatorId,
                'title' => $issue['title'],
                'description' => $issue['body'] ?: null,
                'position' => $position + 1,
                'priority' => 'none',
                'source_system' => 'github',
                'source_card_id' => (string) $issue['id'],
            ]);

            GithubCardLink::create([
                'card_id' => $card->id,
                'github_repository_id' => $this->event->github_repository_id,
                'github_issue_id' => $issue['id'],
                'issue_number' => $issue['number'],
                'issue_url' => $issue['html_url'],
                'issue_state' => $issue['state'],
                'last_synced_source' => 'github',
                'last_synced_at' => now(),
            ]);
        }
    }

    private function handlePullRequestEvent(array $payload, ActivityLogService $activityLog): void
    {
        $action = $payload['action'] ?? null;
        $pullRequest = $payload['pull_request'] ?? null;

        if (! $action || ! is_array($pullRequest)) {
            return;
        }

        if (! in_array($action, ['opened', 'ready_for_review'], true)) {
            return;
        }

        if ($action === 'opened' && ($pullRequest['draft'] ?? false)) {
            return;
        }

        if (($pullRequest['user']['login'] ?? null) !== self::COPILOT_AGENT_LOGIN) {
            return;
        }

        $issueNumbers = $this->extractReferencedIssueNumbers($pullRequest['body'] ?? '');

        if ($issueNumbers === []) {
            return;
        }

        GithubCardLink::query()
            ->where('github_repository_id', '=', $this->event->github_repository_id)
            ->with('card.board.copilotDoneList')
            ->get()
            ->filter(fn (GithubCardLink $link): bool => in_array($link->issue_number, $issueNumbers, true))
            ->each(fn (GithubCardLink $link) => $this->moveCardToCopilotDoneList($link, $activityLog));
    }

    /**
     * @return array<int, int>
     */
    private function extractReferencedIssueNumbers(string $body): array
    {
        if ($body === '') {
            return [];
        }

        preg_match_all(
            '/\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+(?:[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)?#(\d+)\b/i',
            $body,
            $matches,
        );

        return collect($matches[1] ?? [])
            ->map(fn (string $number): int => (int) $number)
            ->filter(fn (int $number): bool => $number > 0)
            ->unique()
            ->values()
            ->all();
    }

    private function moveCardToCopilotDoneList(GithubCardLink $link, ActivityLogService $activityLog): void
    {
        $card = $link->card;
        $board = $card?->board;
        $targetList = $board?->copilotDoneList;

        if (! $card || ! $board || ! $targetList) {
            return;
        }

        if ($targetList->board_id !== $board->id || $targetList->archived_at || $card->list_id === $targetList->id) {
            return;
        }

        $oldListId = $card->list_id;
        $nextPosition = ((Card::query()
            ->where('list_id', '=', $targetList->id)
            ->where('archived_at', '=', null)
            ->orderByDesc('position')
            ->value('position')) ?? 0) + 1;

        $card->update([
            'list_id' => $targetList->id,
            'position' => $nextPosition,
        ]);

        $activityLog->log(
            $card,
            'card_moved',
            old: ['list_id' => $oldListId],
            new: ['list_id' => $targetList->id, 'position' => $nextPosition],
            metadata: ['source' => 'github_copilot_done'],
        );

        event(new CardMoved($card, $oldListId, actorName: 'GitHub Copilot'));
    }
}
