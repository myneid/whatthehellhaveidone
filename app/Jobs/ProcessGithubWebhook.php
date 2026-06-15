<?php

namespace App\Jobs;

use App\Models\Card;
use App\Models\GithubCardLink;
use App\Models\GithubWebhookEvent;
use App\Services\CardListMoveService;
use App\Services\GithubPullRequestIssueMatcher;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class ProcessGithubWebhook implements ShouldQueue
{
    use Queueable;

    public function __construct(public readonly GithubWebhookEvent $event) {}

    public function handle(
        CardListMoveService $cardListMove,
        GithubPullRequestIssueMatcher $issueMatcher,
    ): void {
        try {
            match ($this->event->event_type) {
                'issues' => $this->handleIssueEvent($this->event->payload, $cardListMove),
                'pull_request' => $this->handlePullRequestEvent($this->event->payload, $cardListMove, $issueMatcher),
                default => null,
            };

            $this->event->update(['processed_at' => now()]);
        } catch (Throwable $e) {
            $this->event->update(['failed_at' => now(), 'failure_reason' => $e->getMessage()]);
            throw $e;
        }
    }

    private function handleIssueEvent(array $payload, CardListMoveService $cardListMove): void
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

        if ($action === 'closed') {
            $cardListMove->moveCardToDoneList($card->fresh(), 'github_issue_closed');
        }
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

    private function handlePullRequestEvent(
        array $payload,
        CardListMoveService $cardListMove,
        GithubPullRequestIssueMatcher $issueMatcher,
    ): void {
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

        $pullNumber = (int) ($pullRequest['number'] ?? 0);
        if ($pullNumber <= 0) {
            return;
        }

        $issueNumbers = $issueMatcher->extractIssueNumbers($pullRequest);

        if ($issueNumbers === []) {
            return;
        }

        $linkedCards = GithubCardLink::query()
            ->where('github_repository_id', '=', $this->event->github_repository_id)
            ->with('card.board.copilotDoneList')
            ->get()
            ->filter(fn (GithubCardLink $link): bool => in_array($link->issue_number, $issueNumbers, true));

        if ($linkedCards->isEmpty()) {
            return;
        }

        $linkedCards->each(fn (GithubCardLink $link) => $this->moveCardToCopilotDoneList(
            $link,
            $cardListMove,
            $pullRequest,
        ));

        if ($linkedCards->contains(fn (GithubCardLink $link): bool => $link->request_copilot_review)) {
            RequestGithubCopilotReview::dispatch($this->event->githubRepository, $pullNumber);
        }
    }

    private function moveCardToCopilotDoneList(
        GithubCardLink $link,
        CardListMoveService $cardListMove,
        array $pullRequest,
    ): void {
        $card = $link->card;
        $board = $card?->board;
        $targetList = $board?->copilotDoneList;

        if (! $card || ! $board || ! $targetList) {
            return;
        }

        $pullNumber = (int) ($pullRequest['number'] ?? 0);

        if ($pullNumber > 0) {
            $link->update([
                'pull_request_number' => $pullNumber,
                'pull_request_url' => $pullRequest['html_url'] ?? null,
                'pull_request_state' => $pullRequest['state'] ?? 'open',
                'last_synced_source' => 'github',
                'last_synced_at' => now(),
            ]);
        }

        $cardListMove->moveCardToList($card, $targetList, 'github_pull_request');
    }
}
