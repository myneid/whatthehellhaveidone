<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\Checklist;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('a mobile client can issue inspect and revoke a sanctum token', function () {
    $user = User::factory()->create();

    $tokenResponse = $this->postJson(route('api.auth.token.store'), [
        'email' => $user->email,
        'password' => 'password',
        'device_name' => 'iPhone 16 Pro',
    ]);

    $tokenResponse->assertSuccessful()
        ->assertJsonPath('token_type', 'Bearer')
        ->assertJsonPath('user.id', $user->id);

    $token = $tokenResponse->json('access_token');

    $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson(route('api.auth.me'))
        ->assertSuccessful()
        ->assertJsonPath('user.email', $user->email);

    $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson(route('api.mobile.bootstrap'))
        ->assertSuccessful()
        ->assertJsonPath('user.id', $user->id)
        ->assertJsonPath('features.secure_storage', true);

    $this->withHeader('Authorization', 'Bearer '.$token)
        ->deleteJson(route('api.auth.token.destroy'))
        ->assertNoContent();

    $this->withHeader('Authorization', 'Bearer '.$token)
        ->getJson(route('api.auth.me'))
        ->assertUnauthorized();
});

test('a mobile client can complete the core project board and card workflow via api', function () {
    $user = User::factory()->create();

    $token = $this->postJson(route('api.auth.token.store'), [
        'email' => $user->email,
        'password' => 'password',
        'device_name' => 'iPhone 16 Pro',
    ])->json('access_token');

    $auth = ['Authorization' => 'Bearer '.$token, 'Accept' => 'application/json'];

    $projectResponse = $this->withHeaders($auth)->postJson(route('api.projects.store'), [
        'name' => 'Mobile Launch',
        'description' => 'Native client rollout',
    ]);

    $projectResponse->assertCreated()
        ->assertJsonPath('project.name', 'Mobile Launch');

    $projectId = $projectResponse->json('project.id');

    $dashboardResponse = $this->withHeaders($auth)->getJson(route('api.projects.index'));

    $dashboardResponse->assertSuccessful()
        ->assertJsonCount(1, 'projects')
        ->assertJsonCount(0, 'standaloneBoards');

    $boardResponse = $this->withHeaders($auth)->postJson(route('api.boards.store'), [
        'project_id' => $projectId,
        'name' => 'iOS Shell',
        'visibility' => 'private',
    ]);

    $boardResponse->assertCreated()
        ->assertJsonPath('board.name', 'iOS Shell');

    $boardId = $boardResponse->json('board.id');
    $boardSlug = $boardResponse->json('board.slug');
    $todoListId = $boardResponse->json('board.todo_list_id');

    $this->withHeaders($auth)
        ->getJson(route('api.boards.show', $boardSlug))
        ->assertSuccessful()
        ->assertJsonPath('board.id', $boardId);

    $listResponse = $this->withHeaders($auth)->postJson(route('api.boards.lists.store', $boardSlug), [
        'name' => 'Blocked',
    ]);

    $listResponse->assertCreated()
        ->assertJsonPath('list.name', 'Blocked');

    $cardResponse = $this->withHeaders($auth)->postJson(route('api.cards.store'), [
        'list_id' => $todoListId,
        'title' => 'Ship the mobile dashboard',
        'description' => 'Use the new EDGE mobile shell',
    ]);

    $cardResponse->assertCreated()
        ->assertJsonPath('card.title', 'Ship the mobile dashboard');

    $cardId = $cardResponse->json('card.id');

    $commentResponse = $this->withHeaders($auth)->postJson(route('api.cards.comments.store', $cardId), [
        'body' => 'Initial mobile-ready card comment',
    ]);

    $commentResponse->assertCreated()
        ->assertJsonPath('comment.body', 'Initial mobile-ready card comment');

    $checklistResponse = $this->withHeaders($auth)->postJson(route('api.cards.checklists.store', $cardId), [
        'name' => 'Launch checklist',
    ]);

    $checklistResponse->assertCreated()
        ->assertJsonPath('checklist.name', 'Launch checklist');

    $checklistId = $checklistResponse->json('checklist.id');

    $itemResponse = $this->withHeaders($auth)->postJson(route('api.checklists.items.store', $checklistId), [
        'name' => 'Verify iOS shell',
    ]);

    $itemResponse->assertCreated()
        ->assertJsonPath('item.name', 'Verify iOS shell');

    $itemId = $itemResponse->json('item.id');

    $this->withHeaders($auth)
        ->patchJson(route('api.checklist-items.toggle', $itemId))
        ->assertSuccessful()
        ->assertJsonPath('item.is_completed', true);

    expect(Project::query()->whereKey($projectId)->exists())->toBeTrue()
        ->and(Board::query()->whereKey($boardId)->exists())->toBeTrue()
        ->and(BoardList::query()->where('board_id', $boardId)->count())->toBeGreaterThan(5)
        ->and(Card::query()->whereKey($cardId)->exists())->toBeTrue()
        ->and(Checklist::query()->whereKey($checklistId)->exists())->toBeTrue();
});
