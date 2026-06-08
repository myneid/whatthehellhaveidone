<?php

namespace App\Services;

use App\Models\Card;
use App\Models\GithubCardLink;
use App\Models\GithubRepository;
use RuntimeException;

class GithubCardIssueService
{
    public function __construct(private readonly GitHubService $github) {}

    public function ensureIssueForCard(Card $card, ?int $repositoryId = null): ?GithubCardLink
    {
        $card->loadMissing(['githubLink', 'board.githubRepositories']);

        if ($card->githubLink) {
            return $card->githubLink;
        }

        $repositories = $card->board?->githubRepositories();

        if (! $repositories) {
            return null;
        }

        $repo = $repositoryId
            ? $repositories->where('github_repositories.id', $repositoryId)->first()
            : $repositories->first();

        if (! $repo instanceof GithubRepository) {
            return null;
        }

        $account = $this->github->getAccountForRepo($repo);
        $issue = $this->github->createIssue($account, $repo, $card->title, $card->description);

        return GithubCardLink::create([
            'card_id' => $card->id,
            'github_repository_id' => $repo->id,
            'github_issue_id' => $issue['id'],
            'issue_number' => $issue['number'],
            'issue_url' => $issue['html_url'],
            'issue_state' => $issue['state'],
            'request_copilot_review' => true,
            'last_synced_source' => 'board',
            'last_synced_at' => now(),
        ]);
    }

    /**
     * @throws RuntimeException
     */
    public function ensureIssueForCardOrFail(Card $card, ?int $repositoryId = null): GithubCardLink
    {
        $link = $this->ensureIssueForCard($card, $repositoryId);

        if (! $link) {
            throw new RuntimeException('Connect a GitHub repository to this board before assigning work.');
        }

        return $link;
    }
}
