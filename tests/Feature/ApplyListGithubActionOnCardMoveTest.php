<?php

use App\Events\CardMoved;
use App\Listeners\ApplyListGithubActionOnCardMove;
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

uses(RefreshDatabase::class);

/**
 * @return array{0: Board, 1: Card, 2: GithubRepository, 3: GithubCardLink}
 */
function createBoardWithLinkedPullRequest(User $owner): array
{
    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-pr-actions',
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

    return [$board, $card, $repository, $link];
}

it('closes the linked pull request when a card is moved to a list configured to close pull requests', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/pulls/9' => Http::response([
            'number' => 9,
            'state' => 'closed',
            'merged' => false,
            'html_url' => 'https://github.com/octo-org/octo-repo/pull/9',
        ], 200),
    ]);

    /** @var User $owner */
    $owner = User::factory()->create();

    [$board, $card, , $link] = createBoardWithLinkedPullRequest($owner);

    $done = BoardList::query()->where('board_id', $board->id)->where('name', 'Done')->firstOrFail();
    $done->update(['github_action' => 'close_pull_request']);

    $listener = app(ApplyListGithubActionOnCardMove::class);
    $listener->handle(new CardMoved($card->fresh(), $done->id, $owner));

    $link->refresh();

    expect($link->pull_request_state)->toBe('closed');

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://api.github.com/repos/octo-org/octo-repo/pulls/9'
            && $request->method() === 'PATCH'
            && $request['state'] === 'closed';
    });
});

it('merges the linked pull request when a card is moved to a list configured to merge pull requests', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/pulls/9/merge' => Http::response([
            'merged' => true,
            'sha' => 'abc123',
        ], 200),
    ]);

    /** @var User $owner */
    $owner = User::factory()->create();

    [$board, $card, , $link] = createBoardWithLinkedPullRequest($owner);

    $done = BoardList::query()->where('board_id', $board->id)->where('name', 'Done')->firstOrFail();
    $done->update(['github_action' => 'merge_pull_request']);

    $listener = app(ApplyListGithubActionOnCardMove::class);
    $listener->handle(new CardMoved($card->fresh(), $done->id, $owner));

    $link->refresh();

    expect($link->pull_request_state)->toBe('merged');

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://api.github.com/repos/octo-org/octo-repo/pulls/9/merge'
            && $request->method() === 'PUT';
    });
});

it('does not call github when a pull request action is configured but no pull request is linked', function (): void {
    Http::fake();

    /** @var User $owner */
    $owner = User::factory()->create();

    [$board, $card, , $link] = createBoardWithLinkedPullRequest($owner);
    $link->update([
        'pull_request_number' => null,
        'pull_request_url' => null,
        'pull_request_state' => null,
    ]);

    $done = BoardList::query()->where('board_id', $board->id)->where('name', 'Done')->firstOrFail();
    $done->update(['github_action' => 'merge_pull_request']);

    $listener = app(ApplyListGithubActionOnCardMove::class);
    $listener->handle(new CardMoved($card->fresh(), $done->id, $owner));

    Http::assertNothingSent();
});
