<?php

use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;

uses(RefreshDatabase::class);

it('returns an inertia-compatible redirect when moving a card from an inertia request', function (): void {
    Gate::before(fn () => true);

    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-3',
        'visibility' => 'team',
    ]);

    $fromList = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $toList = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Doing',
        'position' => 2,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $fromList->id,
        'creator_id' => $user->id,
        'title' => 'Move me',
        'position' => 1,
    ]);

    $response = $this->actingAs($user)
        ->from('/boards/'.$board->slug)
        ->withHeader('X-Inertia', 'true')
        ->post(route('cards.move', $card), [
            'list_id' => $toList->id,
            'position' => 1,
        ]);

    $response->assertRedirect('/boards/'.$board->slug);

    expect($card->fresh()->list_id)->toBe($toList->id)
        ->and($card->fresh()->position)->toBe(1);
});

it('appends a card to the end of another list when moving from the card view', function (): void {
    Gate::before(fn () => true);

    $user = User::factory()->create();

    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-4',
        'visibility' => 'team',
    ]);

    $fromList = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Doing',
        'position' => 1,
    ]);

    $toList = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Done',
        'position' => 2,
    ]);

    Card::create([
        'board_id' => $board->id,
        'list_id' => $toList->id,
        'creator_id' => $user->id,
        'title' => 'Already done',
        'position' => 1,
    ]);

    Card::create([
        'board_id' => $board->id,
        'list_id' => $toList->id,
        'creator_id' => $user->id,
        'title' => 'Wrapped up',
        'position' => 2,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $fromList->id,
        'creator_id' => $user->id,
        'title' => 'Ship it',
        'position' => 1,
    ]);

    $this->actingAs($user)
        ->from('/boards/'.$board->slug)
        ->withHeader('X-Inertia', 'true')
        ->post(route('cards.move', $card), [
            'list_id' => $toList->id,
            'position' => 3,
        ])
        ->assertRedirect('/boards/'.$board->slug);

    expect($card->fresh()->list_id)->toBe($toList->id)
        ->and($card->fresh()->position)->toBe(3);
});
