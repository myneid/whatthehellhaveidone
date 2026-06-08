<?php

use App\BoardMemberRole;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\BoardMember;
use App\Models\Card;
use App\Models\GithubAccount;
use App\Models\GithubRepository;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

it('allows a board member to create a card', function (): void {
    $owner = User::factory()->create();
    $member = User::factory()->create();

    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-store-member',
        'visibility' => 'private',
    ]);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $member->id,
        'role' => BoardMemberRole::Member->value,
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $this->actingAs($member)
        ->from('/boards/'.$board->slug)
        ->post(route('cards.store'), [
            'list_id' => $list->id,
            'title' => 'Card by member',
        ])
        ->assertRedirect('/boards/'.$board->slug);

    $card = Card::query()->first();

    expect($card)->not->toBeNull()
        ->and($card->title)->toBe('Card by member')
        ->and($card->creator_id)->toBe($member->id)
        ->and($card->board_id)->toBe($board->id)
        ->and($card->list_id)->toBe($list->id);
});

it('forbids a board viewer from creating a card', function (): void {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();

    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-store-viewer',
        'visibility' => 'private',
    ]);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $viewer->id,
        'role' => BoardMemberRole::Viewer->value,
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $this->actingAs($viewer)
        ->post(route('cards.store'), [
            'list_id' => $list->id,
            'title' => 'Viewer cannot create',
        ])
        ->assertForbidden();

    expect(Card::count())->toBe(0);
});

it('can create a card with a linked github issue when requested', function (): void {
    Http::fake([
        'https://api.github.com/repos/octo-org/octo-repo/issues' => Http::response([
            'id' => 999,
            'number' => 15,
            'html_url' => 'https://github.com/octo-org/octo-repo/issues/15',
            'state' => 'open',
        ], 201),
    ]);

    $owner = User::factory()->create();

    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-store-github',
        'visibility' => 'private',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'To Do',
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

    $this->actingAs($owner)
        ->from('/boards/'.$board->slug)
        ->post(route('cards.store'), [
            'list_id' => $list->id,
            'title' => 'New pricing card',
            'create_github_issue' => true,
            'github_repository_id' => $repository->id,
        ])
        ->assertRedirect('/boards/'.$board->slug);

    $card = Card::query()->first();

    expect($card)->not->toBeNull()
        ->and($card->githubLink?->issue_number)->toBe(15);

    Http::assertSent(fn ($request): bool => $request->url() === 'https://api.github.com/repos/octo-org/octo-repo/issues'
        && $request['title'] === 'New pricing card');
});
