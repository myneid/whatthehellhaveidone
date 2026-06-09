<?php

namespace App\Services;

use App\Models\GithubCardLink;
use RuntimeException;

class GithubPullRequestService
{
    public function __construct(private readonly GitHubService $github) {}

    public function close(GithubCardLink $link): GithubCardLink
    {
        $this->assertPullRequestLinked($link);

        $repo = $link->githubRepository;
        $account = $this->github->getAccountForRepo($repo);

        $pullRequest = $this->github->closePullRequest(
            $account,
            $repo,
            $link->pull_request_number,
        );

        $link->update([
            'pull_request_state' => $pullRequest['state'] ?? 'closed',
            'last_synced_at' => now(),
        ]);

        return $link->fresh();
    }

    public function merge(GithubCardLink $link): GithubCardLink
    {
        $this->assertPullRequestLinked($link);

        $repo = $link->githubRepository;
        $account = $this->github->getAccountForRepo($repo);

        $pullRequest = $this->github->mergePullRequest(
            $account,
            $repo,
            $link->pull_request_number,
        );

        $link->update([
            'pull_request_state' => ($pullRequest['merged'] ?? false)
                ? 'merged'
                : ($pullRequest['state'] ?? 'merged'),
            'last_synced_at' => now(),
        ]);

        return $link->fresh();
    }

    private function assertPullRequestLinked(GithubCardLink $link): void
    {
        if (! $link->pull_request_number) {
            throw new RuntimeException('This card does not have a linked pull request.');
        }
    }
}
