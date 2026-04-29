<?php

use App\Http\Controllers\BoardListController;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

uses(RefreshDatabase::class);

it('reorders row positions when moving a row', function (): void {
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

    auth()->login($user);
    $request = Request::create('/lists/'.$first->id, 'PATCH', ['position' => 3]);
    $request->setUserResolver(fn () => $user);

    (new BoardListController)->update($request, $first);

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

    auth()->login($user);
    (new BoardListController)->destroy($second);

    expect($second->fresh()->archived_at)->not->toBeNull()
        ->and($first->fresh()->position)->toBe(1)
        ->and($third->fresh()->position)->toBe(2);
});
