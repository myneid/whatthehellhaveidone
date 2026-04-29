<?php

namespace App\Jobs;

use App\Models\Card;
use App\Models\GithubCardLink;
use App\Models\GithubWebhookEvent;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class ProcessGithubWebhook implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly GithubWebhookEvent $event) {}

    public function handle(): void
    {
        try {
            match ($this->event->event_type) {
                'issues' => $this->handleIssueEvent($this->event->payload),
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

        $link = GithubCardLink::where('github_repository_id', $this->event->github_repository_id)
            ->where('issue_number', $issue['number'])
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

            $position = Card::where('list_id', $list->id)->whereNull('archived_at')->max('position') ?? 0;

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
}
