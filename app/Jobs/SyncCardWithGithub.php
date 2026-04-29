<?php

namespace App\Jobs;

use App\Models\Card;
use App\Models\GithubCardLink;
use App\Models\GithubRepository;
use App\Models\User;
use App\Services\GitHubService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SyncCardWithGithub implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Card $card,
        public readonly int $repositoryId,
        public readonly int $issueNumber,
        public readonly User $user,
    ) {}

    public function handle(GitHubService $github): void
    {
        $repo = GithubRepository::findOrFail($this->repositoryId);
        $account = $github->getAccountForRepo($repo);

        $issue = $github->getIssue($account, $repo, $this->issueNumber);

        // Upsert the link record
        $link = GithubCardLink::updateOrCreate(
            [
                'card_id' => $this->card->id,
                'github_repository_id' => $repo->id,
            ],
            [
                'github_issue_id' => $issue['id'],
                'issue_number' => $issue['number'],
                'issue_url' => $issue['html_url'],
                'issue_state' => $issue['state'],
                'last_synced_source' => 'github',
                'last_synced_at' => now(),
            ],
        );

        // Sync card fields from the GitHub issue (GitHub is the source of truth here)
        $updates = [];

        if ($this->card->title !== $issue['title']) {
            $updates['title'] = $issue['title'];
        }

        if (($this->card->description ?? '') !== ($issue['body'] ?? '')) {
            $updates['description'] = $issue['body'] ?: null;
        }

        if ($issue['state'] === 'closed' && ! $this->card->completed_at) {
            $updates['completed_at'] = now();
        } elseif ($issue['state'] === 'open' && $this->card->completed_at) {
            $updates['completed_at'] = null;
        }

        if ($updates) {
            $this->card->update($updates);
        }
    }
}
