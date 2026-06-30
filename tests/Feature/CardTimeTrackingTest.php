<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\User;
use App\Models\WorkLogEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('board payload includes cumulative tracked time for cards', function (): void {
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-time-tracking',
        'visibility' => 'team',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'In Progress',
        'position' => 1,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $user->id,
        'title' => 'Implement time tracking',
        'position' => 1,
    ]);

    WorkLogEntry::create([
        'user_id' => $user->id,
        'board_id' => $board->id,
        'card_id' => $card->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'Worked 4 hours on planning',
        'duration_seconds' => 4 * 3600,
    ]);

    WorkLogEntry::create([
        'user_id' => $user->id,
        'board_id' => $board->id,
        'card_id' => $card->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'Worked 1 hour on final polish',
        'duration_seconds' => 3600,
    ]);

    WorkLogEntry::create([
        'user_id' => $user->id,
        'board_id' => $board->id,
        'card_id' => $card->id,
        'source' => 'manual',
        'entry_type' => 'manual',
        'body' => 'Added a note without timing',
    ]);

    $this->actingAs($user)
        ->get(route('boards.show', $board))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('boards/show')
            ->where('board.lists.0.cards.0.time_spent_seconds_total', 5 * 3600)
            ->has('board.lists.0.cards.0.work_log_entries', 2));
});
