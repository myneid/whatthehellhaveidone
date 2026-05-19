<?php

namespace App\Listeners;

use App\Events\CardMoved;
use App\Models\BoardList;
use App\Services\GithubCardIssueService;
use App\Services\GitHubService;
use Illuminate\Contracts\Queue\ShouldQueue;

class ApplyListGithubActionOnCardMove implements ShouldQueue
{
    public function __construct(
        private readonly GitHubService $github,
        private readonly GithubCardIssueService $githubCardIssues,
    ) {}

    public function handle(CardMoved $event): void
    {
        $card = $event->card;
        $list = BoardList::find($card->list_id);

        if (! $list || ! $list->github_action) {
            return;
        }

        $link = $card->githubLink;
        if (! $link) {
            if ($list->github_action === 'open_issue') {
                $this->githubCardIssues->ensureIssueForCard($card);
            }

            return;
        }

        $repo = $link->githubRepository;
        $account = $this->github->getAccountForRepo($repo);

        match ($list->github_action) {
            'close_issue' => $this->github->updateIssue($account, $repo, $link->issue_number, ['state' => 'closed']),
            'reopen_issue' => $this->github->updateIssue($account, $repo, $link->issue_number, ['state' => 'open']),
            'open_issue' => null, // already linked, nothing to do
            default => null,
        };

        $link->update(['issue_state' => $list->github_action === 'close_issue' ? 'closed' : 'open', 'last_synced_at' => now()]);
    }
}
