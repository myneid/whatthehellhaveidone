<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;

uses(RefreshDatabase::class);

it('reorders other rows when moving a row position', function (): void {
    Gate::before(fn () => true);

    $user = User::factory()->create();
    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-1',
        'visibility' => 'team',
    ]);
    $board->members()->create([
        'user_id' => $user->id,
        'role' => 'admin',
    ]);

    $first = BoardList::create(['board_id' => $board->id, 'name' => 'Backlog', 'position' => 1]);
    $second = BoardList::create(['board_id' => $board->id, 'name' => 'Doing', 'position' => 2]);
    $third = BoardList::create(['board_id' => $board->id, 'name' => 'Done', 'position' => 3]);

    $this->actingAs($user)
        ->patch(route('lists.update', $first), ['position' => 3])
        ->assertRedirect();

    expect($first->fresh()->position)->toBe(3)
        ->and($second->fresh()->position)->toBe(1)
        ->and($third->fresh()->position)->toBe(2);
});

it('compacts row positions after deleting a row', function (): void {
    Gate::before(fn () => true);

    $user = User::factory()->create();
    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-2',
        'visibility' => 'team',
    ]);
    $board->members()->create([
        'user_id' => $user->id,
        'role' => 'admin',
    ]);

    $first = BoardList::create(['board_id' => $board->id, 'name' => 'Backlog', 'position' => 1]);
    $second = BoardList::create(['board_id' => $board->id, 'name' => 'Doing', 'position' => 2]);
    $third = BoardList::create(['board_id' => $board->id, 'name' => 'Done', 'position' => 3]);

    $this->actingAs($user)
        ->delete(route('lists.destroy', $second))
        ->assertRedirect();

    expect($second->fresh()->archived_at)->not->toBeNull()
        ->and($first->fresh()->position)->toBe(1)
        ->and($third->fresh()->position)->toBe(2);
});
