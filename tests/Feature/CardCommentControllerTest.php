<?php

use App\BoardMemberRole;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\BoardMember;
use App\Models\Card;
use App\Models\CardComment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function createCommentFixture(): array
{
    $owner = User::factory()->create();
    $author = User::factory()->create();
    $otherMember = User::factory()->create();

    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-comment-edit',
        'visibility' => 'private',
    ]);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $author->id,
        'role' => BoardMemberRole::Member->value,
    ]);

    BoardMember::create([
        'board_id' => $board->id,
        'user_id' => $otherMember->id,
        'role' => BoardMemberRole::Member->value,
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'To Do',
        'position' => 1,
    ]);

    $card = Card::create([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $owner->id,
        'title' => 'Test card',
        'position' => 1,
    ]);

    $comment = CardComment::create([
        'card_id' => $card->id,
        'user_id' => $author->id,
        'body' => 'Original comment',
    ]);

    return [$author, $otherMember, $board, $card, $comment];
}

it('allows a board member to post a comment', function (): void {
    [$author, , $board, $card] = createCommentFixture();

    $this->actingAs($author)
        ->from('/boards/'.$board->slug)
        ->post(route('cards.comments.store', $card), [
            'body' => 'New top-level comment',
        ])
        ->assertRedirect('/boards/'.$board->slug);

    expect($card->comments()->where('body', 'New top-level comment')->exists())->toBeTrue();
});

it('allows a board member to reply to another users comment', function (): void {
    [$author, $otherMember, $board, $card, $comment] = createCommentFixture();

    $this->actingAs($otherMember)
        ->from('/boards/'.$board->slug)
        ->post(route('cards.comments.store', $card), [
            'body' => 'Thanks for the update',
            'parent_id' => $comment->id,
        ])
        ->assertRedirect('/boards/'.$board->slug);

    $reply = CardComment::query()
        ->where('parent_id', $comment->id)
        ->where('user_id', $otherMember->id)
        ->first();

    expect($reply)->not->toBeNull()
        ->and($reply->body)->toBe('Thanks for the update')
        ->and($reply->card_id)->toBe($card->id);
});

it('rejects a reply when the parent comment belongs to another card', function (): void {
    [$author, $otherMember, $board, $card, $comment] = createCommentFixture();

    $otherCard = Card::create([
        'board_id' => $board->id,
        'list_id' => $card->list_id,
        'creator_id' => $author->id,
        'title' => 'Another card',
        'position' => 2,
    ]);

    $this->actingAs($otherMember)
        ->from('/boards/'.$board->slug)
        ->post(route('cards.comments.store', $otherCard), [
            'body' => 'Wrong thread',
            'parent_id' => $comment->id,
        ])
        ->assertSessionHasErrors('parent_id');

    expect(CardComment::query()->where('parent_id', $comment->id)->count())->toBe(0);
});

it('rejects a reply with an invalid parent id', function (): void {
    [$author, , $board, $card] = createCommentFixture();

    $this->actingAs($author)
        ->from('/boards/'.$board->slug)
        ->post(route('cards.comments.store', $card), [
            'body' => 'Orphan reply',
            'parent_id' => 99999,
        ])
        ->assertSessionHasErrors('parent_id');
});

it('allows the comment author to update their comment', function (): void {
    [$author, , $board, , $comment] = createCommentFixture();

    $this->actingAs($author)
        ->from('/boards/'.$board->slug)
        ->patch(route('comments.update', $comment), [
            'body' => 'Updated comment',
        ])
        ->assertRedirect('/boards/'.$board->slug);

    expect($comment->fresh()->body)->toBe('Updated comment');
});

it('forbids another board member from updating a comment', function (): void {
    [$author, $otherMember, , , $comment] = createCommentFixture();

    $this->actingAs($otherMember)
        ->patch(route('comments.update', $comment), [
            'body' => 'Hijacked comment',
        ])
        ->assertForbidden();

    expect($comment->fresh()->body)->toBe('Original comment');
});

it('requires a body when updating a comment', function (): void {
    [$author, , $board, , $comment] = createCommentFixture();

    $this->actingAs($author)
        ->from('/boards/'.$board->slug)
        ->patch(route('comments.update', $comment), [
            'body' => '',
        ])
        ->assertSessionHasErrors('body');

    expect($comment->fresh()->body)->toBe('Original comment');
});

it('allows the comment author to delete their comment', function (): void {
    [$author, , $board, , $comment] = createCommentFixture();

    $this->actingAs($author)
        ->from('/boards/'.$board->slug)
        ->delete(route('comments.destroy', $comment))
        ->assertRedirect('/boards/'.$board->slug);

    expect(CardComment::query()->find($comment->id))->toBeNull();
});
