<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

it('updates the copilot done list for a board', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-board-settings',
        'visibility' => 'team',
    ]);

    $reviewList = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Review',
        'position' => 1,
    ]);

    $response = actingAs($user)
        ->from(route('boards.show', $board))
        ->put(route('boards.update', $board), [
            'copilot_done_list_id' => $reviewList->id,
        ]);

    $response->assertRedirect(route('boards.show', $board));

    expect($board->fresh()->copilot_done_list_id)->toBe($reviewList->id);
});

it('defaults new boards to use the review column as the copilot done list', function (): void {
    /** @var User $user */
    $user = User::factory()->create();

    $response = actingAs($user)->post(route('boards.store'), [
        'name' => 'Launch Plan',
        'visibility' => 'team',
    ]);

    $board = Board::query()->latest('id')->firstOrFail();

    $response->assertRedirect(route('boards.show', $board));

    expect($board->copilot_done_list_id)->not()->toBeNull();
    expect($board->copilotDoneList?->name)->toBe('Review');
});
