<?php

namespace App\Services;

class GithubPullRequestIssueMatcher
{
    /**
     * @param  array<string, mixed>  $pullRequest
     * @return array<int, int>
     */
    public function extractIssueNumbers(array $pullRequest): array
    {
        $body = (string) ($pullRequest['body'] ?? '');
        $title = (string) ($pullRequest['title'] ?? '');
        $branch = (string) ($pullRequest['head']['ref'] ?? '');

        $numbers = [];

        preg_match_all(
            '/\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s+(?:[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)?#(\d+)\b/i',
            $body,
            $closingMatches,
        );

        $numbers = array_merge($numbers, $closingMatches[1] ?? []);

        preg_match_all('/(?:[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)?#(\d+)\b/', $body."\n".$title, $referenceMatches);
        $numbers = array_merge($numbers, $referenceMatches[1] ?? []);

        if (preg_match('/\bissue[-_](\d+)\b/i', $branch, $issueBranchMatch) === 1) {
            $numbers[] = $issueBranchMatch[1];
        }

        if (preg_match('/^(\d+)[-_]/', $branch, $prefixBranchMatch) === 1) {
            $numbers[] = $prefixBranchMatch[1];
        }

        return collect($numbers)
            ->map(fn (string|int $number): int => (int) $number)
            ->filter(fn (int $number): bool => $number > 0)
            ->unique()
            ->values()
            ->all();
    }
}
