<?php

use App\Services\GithubPullRequestIssueMatcher;

it('extracts issue numbers from closing keywords, references, and branch names', function (): void {
    $matcher = new GithubPullRequestIssueMatcher;

    $numbers = $matcher->extractIssueNumbers([
        'title' => 'Update nav (#42)',
        'body' => 'Also relates to #99',
        'head' => ['ref' => 'issue-7-feature'],
    ]);

    expect($numbers)->toEqualCanonicalizing([42, 99, 7]);
});

it('returns unique positive issue numbers only', function (): void {
    $matcher = new GithubPullRequestIssueMatcher;

    $numbers = $matcher->extractIssueNumbers([
        'title' => 'Fixes #5',
        'body' => 'Fixes #5 and closes org/repo#5',
        'head' => ['ref' => '5-update'],
    ]);

    expect($numbers)->toBe([5]);
});
