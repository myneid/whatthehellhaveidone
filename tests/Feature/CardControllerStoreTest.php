<?php

use App\BoardMemberRole;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\BoardMember;
use App\Models\Card;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

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
