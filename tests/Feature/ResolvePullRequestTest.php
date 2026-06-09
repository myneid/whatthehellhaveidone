<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\GithubAccount;
use App\Models\GithubCardLink;
use App\Models\GithubRepository;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

/**
 * @return array{0: Card, 1: GithubCardLink}
 */
function createCardWithLinkedPullRequest(User $owner): array
{
    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-resolve-pr',
        'visibility' => 'team',
    ]);

    $done = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Done',
        'position' => 1,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $done->id,
        'creator_id' => $owner->id,
        'title' => 'Ship the pull request flow',
        'position' => 1,
    ]);

    $account = GithubAccount::create([
        'user_id' => $owner->id,
        'github_user_id' => '12345',
        'username' => 'octocat',
        'encrypted_access_token' => Crypt::encryptString('github-user-token'),
        'scopes' => ['repo'],
    ]);

    $repository = GithubRepository::create([
        'github_account_id' => $account->id,
        'github_repo_id' => '98765',
        'owner' => 'octo-org',
        'name' => 'octo-repo',
        'full_name' => 'octo-org/octo-repo',
        'private' => true,
        'html_url' => 'https://github.com/octo-org/octo-repo',
    ]);

    $board->githubRepositories()->attach($repository->id, [
        'sync_direction' => 'two_way',
    ]);

    $link = GithubCardLink::create([
        'card_id' => $card->id,
        'github_repository_id' => $repository->id,
        'github_issue_id' => '54321',
        'issue_number' => 42,
        'issue_url' => 'https://github.com/octo-org/octo-repo/issues/42',
        'issue_state' => 'open',
        'pull_request_number' => 9,
        'pull_request_url' => 'https://github.com/octo-org/octo-repo/pull/9',
        'pull_request_state' => 'open',
        'last_synced_source' => 'github',
        'last_synced_at' => now(),
    ]);

    return [$card, $link];
}

it('merges a linked pull request from the board modal action', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/pulls/9/merge' => Http::response([
            'merged' => true,
            'sha' => 'abc123',
        ], 200),
    ]);

    /** @var User $owner */
    $owner = User::factory()->create();

    [$card, $link] = createCardWithLinkedPullRequest($owner);

    actingAs($owner)
        ->post(route('github.resolve-pull-request', $card), [
            'action' => 'merge',
        ])
        ->assertRedirect();

    expect($link->fresh()->pull_request_state)->toBe('merged');

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://api.github.com/repos/octo-org/octo-repo/pulls/9/merge'
            && $request->method() === 'PUT';
    });
});

it('closes a linked pull request from the board modal action', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/pulls/9' => Http::response([
            'number' => 9,
            'state' => 'closed',
            'merged' => false,
        ], 200),
    ]);

    /** @var User $owner */
    $owner = User::factory()->create();

    [$card, $link] = createCardWithLinkedPullRequest($owner);

    actingAs($owner)
        ->post(route('github.resolve-pull-request', $card), [
            'action' => 'close',
        ])
        ->assertRedirect();

    expect($link->fresh()->pull_request_state)->toBe('closed');

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://api.github.com/repos/octo-org/octo-repo/pulls/9'
            && $request->method() === 'PATCH'
            && $request['state'] === 'closed';
    });
});
