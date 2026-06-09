<?php

namespace App\Listeners;

use App\Events\CardMoved;
use App\Models\BoardList;
use App\Models\GithubAccount;
use App\Models\GithubCardLink;
use App\Models\GithubRepository;
use App\Services\GithubCardIssueService;
use App\Services\GithubPullRequestService;
use App\Services\GitHubService;
use Illuminate\Contracts\Queue\ShouldQueue;

class ApplyListGithubActionOnCardMove implements ShouldQueue
{
    public function __construct(
        private readonly GitHubService $github,
        private readonly GithubCardIssueService $githubCardIssues,
        private readonly GithubPullRequestService $githubPullRequests,
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

        $linkUpdates = ['last_synced_at' => now()];

        match ($list->github_action) {
            'close_issue' => $this->closeIssue($account, $repo, $link, $linkUpdates),
            'reopen_issue' => $this->reopenIssue($account, $repo, $link, $linkUpdates),
            'close_pull_request' => $link->pull_request_number
                ? $this->githubPullRequests->close($link)
                : null,
            'merge_pull_request' => $link->pull_request_number
                ? $this->githubPullRequests->merge($link)
                : null,
            default => null,
        };

        if (in_array($list->github_action, ['close_pull_request', 'merge_pull_request'], true)) {
            return;
        }

        $link->update($linkUpdates);
    }

    /**
     * @param  array<string, mixed>  $linkUpdates
     */
    private function closeIssue(
        GithubAccount $account,
        GithubRepository $repo,
        GithubCardLink $link,
        array &$linkUpdates,
    ): void {
        $this->github->updateIssue($account, $repo, $link->issue_number, ['state' => 'closed']);
        $linkUpdates['issue_state'] = 'closed';
    }

    /**
     * @param  array<string, mixed>  $linkUpdates
     */
    private function reopenIssue(
        GithubAccount $account,
        GithubRepository $repo,
        GithubCardLink $link,
        array &$linkUpdates,
    ): void {
        $this->github->updateIssue($account, $repo, $link->issue_number, ['state' => 'open']);
        $linkUpdates['issue_state'] = 'open';
    }
}
