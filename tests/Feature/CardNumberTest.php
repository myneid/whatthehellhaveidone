<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('assigns sequential numbers per board when cards are created', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-card-numbers',
        'visibility' => 'team',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $first = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $user->id,
        'title' => 'First card',
        'position' => 1,
    ]);

    $second = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $user->id,
        'title' => 'Second card',
        'position' => 2,
    ]);

    expect($first->number)->toBe(1)
        ->and($second->number)->toBe(2);
});

it('starts numbering independently for each board', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $firstBoard = Board::create([
        'owner_id' => $user->id,
        'name' => 'Alpha',
        'slug' => 'alpha-card-numbers',
        'visibility' => 'team',
    ]);

    $secondBoard = Board::create([
        'owner_id' => $user->id,
        'name' => 'Beta',
        'slug' => 'beta-card-numbers',
        'visibility' => 'team',
    ]);

    $firstList = BoardList::create([
        'board_id' => $firstBoard->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $secondList = BoardList::create([
        'board_id' => $secondBoard->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $alphaCard = Card::create([
        'board_id' => $firstBoard->id,
        'list_id' => $firstList->id,
        'creator_id' => $user->id,
        'title' => 'Alpha card',
        'position' => 1,
    ]);

    $betaCard = Card::create([
        'board_id' => $secondBoard->id,
        'list_id' => $secondList->id,
        'creator_id' => $user->id,
        'title' => 'Beta card',
        'position' => 1,
    ]);

    expect($alphaCard->number)->toBe(1)
        ->and($betaCard->number)->toBe(1);
});

it('includes card numbers when loading a board', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-card-numbers-show',
        'visibility' => 'team',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $user->id,
        'title' => 'Numbered card',
        'position' => 1,
    ]);

    $this->actingAs($user)
        ->get(route('boards.show', $board))
        ->assertSuccessful()
        ->assertInertia(fn ($page) => $page
            ->component('boards/show')
            ->has('board.lists.0.cards.0.number')
            ->where('board.lists.0.cards.0.number', 1));
});
