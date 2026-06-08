<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\GithubAccount;
use App\Models\GithubRepository;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('creates and links a github issue when the user confirms from the board modal', function (): void {
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

    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-open-issue',
        'visibility' => 'team',
    ]);

    $todo = BoardList::create([
        'board_id' => $board->id,
        'name' => 'To Do',
        'position' => 1,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $todo->id,
        'creator_id' => $owner->id,
        'title' => 'Wireframe pricing page',
        'description' => 'Add pricing tiers and CTA.',
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

    actingAs($owner)
        ->post(route('github.open-issue', $card), [
            'github_repository_id' => $repository->id,
        ])
        ->assertRedirect();

    $card->refresh();

    expect($card->githubLink)->not()->toBeNull()
        ->and($card->githubLink?->issue_number)->toBe(12)
        ->and($card->githubLink?->issue_url)->toBe('https://github.com/octo-org/octo-repo/issues/12');

    Http::assertSent(function ($request): bool {
        return $request->url() === 'https://api.github.com/repos/octo-org/octo-repo/issues'
            && $request->method() === 'POST'
            && $request['title'] === 'Wireframe pricing page';
    });
});
