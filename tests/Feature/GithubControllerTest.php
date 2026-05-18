<?php

use App\Models\Board;
use App\Models\BoardGithubRepository;
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

it('assigns a linked issue to the current GitHub Copilot coding agent', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/issues/42/assignees' => Http::response([
            'number' => 42,
            'assignees' => [
                ['login' => 'copilot-swe-agent[bot]'],
            ],
        ], 201),
    ]);

    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-github',
        'visibility' => 'team',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $user->id,
        'title' => 'Teach Copilot the current assignment flow',
        'position' => 1,
    ]);

    $account = GithubAccount::create([
        'user_id' => $user->id,
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

    GithubCardLink::create([
        'card_id' => $card->id,
        'github_repository_id' => $repository->id,
        'github_issue_id' => '54321',
        'issue_number' => 42,
        'issue_url' => 'https://github.com/octo-org/octo-repo/issues/42',
        'issue_state' => 'open',
        'last_synced_source' => 'github',
        'last_synced_at' => now(),
    ]);

    $response = actingAs($user)
        ->from(route('boards.show', $board))
        ->post(route('github.assign-copilot', $card));

    $response->assertRedirect(route('boards.show', $board));
    $response->assertInertiaFlash('toast.type', 'success');
    $response->assertInertiaFlash('toast.message', 'Issue assigned to GitHub Copilot.');

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://api.github.com/repos/octo-org/octo-repo/issues/42/assignees'
            && $request['assignees'] === ['copilot-swe-agent[bot]']
            && $request['agent_assignment']['target_repo'] === 'octo-org/octo-repo';
    });
});

it('registers a github webhook when connecting a repository to a board', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/hooks' => Http::response([
            'id' => 424242,
            'active' => true,
        ], 201),
    ]);

    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-webhook-connect',
        'visibility' => 'team',
    ]);

    $account = GithubAccount::create([
        'user_id' => $user->id,
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

    actingAs($user)
        ->post(route('github.connect-repository', $board), [
            'github_repository_id' => $repository->id,
            'sync_direction' => 'two_way',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    expect($repository->fresh())
        ->webhook_id->toBe('424242')
        ->webhook_secret->not->toBeNull();

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://api.github.com/repos/octo-org/octo-repo/hooks'
            && $request['events'] === ['issues', 'pull_request', 'ping'];
    });

    expect(BoardGithubRepository::query()->where('board_id', $board->id)->where('github_repository_id', $repository->id)->exists())->toBeTrue();
});

it('shows an error toast when assigning a card without a linked GitHub issue', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-github-unlinked',
        'visibility' => 'team',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $user->id,
        'title' => 'This card is not linked yet',
        'position' => 1,
    ]);

    $response = actingAs($user)
        ->from(route('boards.show', $board))
        ->post(route('github.assign-copilot', $card));

    $response->assertRedirect(route('boards.show', $board));
    $response->assertInertiaFlash('toast.type', 'error');
    $response->assertInertiaFlash('toast.message', 'No GitHub issue linked to this card.');
});
