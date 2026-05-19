<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\BoardMember;
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

function createBoardWithGithubLink(User $owner): array
{
    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-assign-work',
        'visibility' => 'team',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'In Progress',
        'position' => 1,
        'github_action' => 'open_issue',
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $owner->id,
        'title' => 'Implement assign work flow',
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

    return [$board, $card, $repository];
}

it('assigns work to a board member and disables copilot review', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/issues' => Http::response([
            'id' => 999,
            'number' => 12,
            'html_url' => 'https://github.com/octo-org/octo-repo/issues/12',
            'state' => 'open',
        ], 201),
    ]);

    /** @var User $owner */
    $owner = User::factory()->create();
    $member = User::factory()->create(['name' => 'Taylor']);

    [$board, $card] = createBoardWithGithubLink($owner);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $member->id,
        'role' => 'member',
    ]);

    actingAs($owner)
        ->post(route('github.assign-work', $card), [
            'mode' => 'user',
            'user_id' => $member->id,
        ])
        ->assertRedirect();

    $card->refresh();

    expect($card->assignees)->toHaveCount(1)
        ->and($card->assignees->first()?->id)->toBe($member->id)
        ->and($card->githubLink?->request_copilot_review)->toBeFalse();

    Http::assertSent(fn ($request): bool => str_contains($request->url(), '/issues') && $request->method() === 'POST');
    Http::assertNotSent(fn ($request): bool => str_contains($request->url(), '/assignees'));
});

it('assigns work to copilot and enables copilot review', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/issues' => Http::response([
            'id' => 999,
            'number' => 12,
            'html_url' => 'https://github.com/octo-org/octo-repo/issues/12',
            'state' => 'open',
        ], 201),
        'https://api.github.com/repos/octo-org/octo-repo/issues/12/assignees' => Http::response([
            'number' => 12,
            'assignees' => [
                ['login' => 'copilot-swe-agent[bot]'],
            ],
        ], 201),
    ]);

    /** @var User $owner */
    $owner = User::factory()->create();

    [, $card] = createBoardWithGithubLink($owner);

    actingAs($owner)
        ->post(route('github.assign-work', $card), [
            'mode' => 'copilot',
        ])
        ->assertRedirect();

    expect($card->fresh()->githubLink?->request_copilot_review)->toBeTrue()
        ->and($card->assignees)->toHaveCount(0);

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://api.github.com/repos/octo-org/octo-repo/issues/12/assignees'
            && $request['assignees'] === ['copilot-swe-agent[bot]'];
    });
});

it('keeps card assignees when copilot assignment fails', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/issues/12/assignees' => Http::response([
            'message' => 'Validation Failed',
        ], 422),
    ]);

    /** @var User $owner */
    $owner = User::factory()->create();
    $member = User::factory()->create(['name' => 'Taylor']);

    [$board, $card, $repository] = createBoardWithGithubLink($owner);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $member->id,
        'role' => 'member',
    ]);

    $card->assignees()->attach($member->id, ['assigned_by' => $owner->id]);

    GithubCardLink::create([
        'card_id' => $card->id,
        'github_repository_id' => $repository->id,
        'github_issue_id' => '999',
        'issue_number' => 12,
        'issue_url' => 'https://github.com/octo-org/octo-repo/issues/12',
        'issue_state' => 'open',
        'request_copilot_review' => false,
        'last_synced_source' => 'board',
        'last_synced_at' => now(),
    ]);

    actingAs($owner)
        ->post(route('github.assign-work', $card), [
            'mode' => 'copilot',
        ])
        ->assertRedirect();

    $card->refresh();

    expect($card->assignees)->toHaveCount(1)
        ->and($card->assignees->first()?->id)->toBe($member->id)
        ->and($card->githubLink?->request_copilot_review)->toBeFalse();
});

it('rejects assigning work to a user who is not on the board', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/issues' => Http::response([
            'id' => 999,
            'number' => 12,
            'html_url' => 'https://github.com/octo-org/octo-repo/issues/12',
            'state' => 'open',
        ], 201),
    ]);

    /** @var User $owner */
    $owner = User::factory()->create();
    $outsider = User::factory()->create();

    [, $card] = createBoardWithGithubLink($owner);

    actingAs($owner)
        ->post(route('github.assign-work', $card), [
            'mode' => 'user',
            'user_id' => $outsider->id,
        ])
        ->assertSessionHasErrors('user_id');
});
