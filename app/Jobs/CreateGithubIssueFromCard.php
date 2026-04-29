<?php

namespace App\Jobs;

use App\Models\Card;
use App\Models\GithubCardLink;
use App\Models\GithubRepository;
use App\Models\User;
use App\Services\GitHubService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CreateGithubIssueFromCard implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Card $card,
        public readonly int $repositoryId,
        public readonly User $user,
    ) {}

    public function handle(GitHubService $github): void
    {
        // Don't create duplicate links
        if ($this->card->githubLink) {
            return;
        }

        $repo = GithubRepository::findOrFail($this->repositoryId);
        $account = $github->getAccountForRepo($repo);

        $issue = $github->createIssue(
            $account,
            $repo,
            $this->card->title,
            $this->card->description,
        );

        GithubCardLink::create([
            'card_id' => $this->card->id,
            'github_repository_id' => $repo->id,
            'github_issue_id' => $issue['id'],
            'issue_number' => $issue['number'],
            'issue_url' => $issue['html_url'],
            'issue_state' => $issue['state'],
            'last_synced_source' => 'board',
            'last_synced_at' => now(),
        ]);
    }
}
