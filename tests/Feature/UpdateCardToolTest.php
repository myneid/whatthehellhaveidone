<?php

use App\Mcp\Tools\UpdateCardTool;
use App\Models\ActivityLog;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;

uses(RefreshDatabase::class);

function makeCardForUpdateTool(User $owner, array $attributes = []): Card
{
    $board = Board::create([
        'owner_id' => $owner->id,
        'name' => 'Roadmap',
        'slug' => 'roadmap-'.uniqid(),
        'visibility' => 'team',
    ]);

    $list = BoardList::create([
        'board_id' => $board->id,
        'name' => 'To Do',
        'position' => 1,
    ]);

    return Card::create(array_merge([
        'board_id' => $board->id,
        'list_id' => $list->id,
        'creator_id' => $owner->id,
        'title' => 'Original title',
        'description' => 'Original description',
        'priority' => 'medium',
        'position' => 1,
    ], $attributes));
}

function runUpdateCardTool(array $arguments): Response
{
    return app(UpdateCardTool::class)->handle(new Request($arguments));
}

function updateCardToolText(array $arguments): string
{
    return runUpdateCardTool($arguments)->content()->toArray()['text'];
}

it('updates only the supplied fields', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $card = makeCardForUpdateTool($user);

    runUpdateCardTool([
        'card_id' => $card->id,
        'title' => 'Revised title',
    ]);

    $card->refresh();

    expect($card->title)->toBe('Revised title')
        ->and($card->description)->toBe('Original description')
        ->and($card->priority)->toBe('medium');
});

it('updates description and priority together', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $card = makeCardForUpdateTool($user);

    runUpdateCardTool([
        'card_id' => $card->id,
        'description' => 'Rewritten body',
        'priority' => 'high',
    ]);

    $card->refresh();

    expect($card->description)->toBe('Rewritten body')
        ->and($card->priority)->toBe('high')
        ->and($card->title)->toBe('Original title');
});

it('clears a nullable field when an explicit null is supplied', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $card = makeCardForUpdateTool($user, ['due_at' => now()->addDay()]);

    runUpdateCardTool([
        'card_id' => $card->id,
        'description' => null,
        'due_at' => null,
    ]);

    $card->refresh();

    expect($card->description)->toBeNull()
        ->and($card->due_at)->toBeNull();
});

it('records a card_updated activity log entry with old and new values', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $card = makeCardForUpdateTool($user);

    runUpdateCardTool([
        'card_id' => $card->id,
        'title' => 'Revised title',
    ]);

    $log = ActivityLog::query()
        ->where('subject_id', $card->id)
        ->where('event_type', 'card_updated')
        ->sole();

    expect($log->actor_id)->toBe($user->id)
        ->and($log->old_values['title'])->toBe('Original title')
        ->and($log->new_values['title'])->toBe('Revised title');
});

it('errors when no updatable field is supplied', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $card = makeCardForUpdateTool($user);

    $response = runUpdateCardTool(['card_id' => $card->id]);

    expect($response->isError())->toBeTrue()
        ->and($response->content()->toArray()['text'])->toContain('No updatable fields supplied');
    expect($card->refresh()->title)->toBe('Original title');
});

it('denies a user who cannot update the card', function (): void {
    $owner = User::factory()->create();
    $card = makeCardForUpdateTool($owner);

    $stranger = User::factory()->create();
    $this->actingAs($stranger);

    $response = runUpdateCardTool([
        'card_id' => $card->id,
        'title' => 'Hijacked',
    ]);

    expect($response->isError())->toBeTrue()
        ->and($response->content()->toArray()['text'])->toContain('Permission denied');
    expect($card->refresh()->title)->toBe('Original title');
});

it('rejects an invalid priority', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $card = makeCardForUpdateTool($user);

    expect(fn () => runUpdateCardTool([
        'card_id' => $card->id,
        'priority' => 'whenever',
    ]))->toThrow(ValidationException::class);

    expect($card->refresh()->priority)->toBe('medium');
});

it('rejects a null title', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $card = makeCardForUpdateTool($user);

    expect(fn () => runUpdateCardTool([
        'card_id' => $card->id,
        'title' => null,
    ]))->toThrow(ValidationException::class);

    expect($card->refresh()->title)->toBe('Original title');
});

it('clears a nullable field when an empty string is supplied', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $card = makeCardForUpdateTool($user, ['due_at' => '2026-12-01 17:00:00']);

    $text = updateCardToolText([
        'card_id' => $card->id,
        'due_at' => '',
        'description' => '',
    ]);

    expect($text)->toContain('changed: description, due_at');

    $card->refresh();
    expect($card->due_at)->toBeNull();
    expect($card->description)->toBeNull();
});

it('does not treat an empty title as a clear request', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $card = makeCardForUpdateTool($user);

    expect(fn () => runUpdateCardTool([
        'card_id' => $card->id,
        'title' => '',
    ]))->toThrow(ValidationException::class);

    expect($card->refresh()->title)->toBe('Original title');
});

it('returns a clean error for a card that does not exist', function (): void {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = runUpdateCardTool([
        'card_id' => 999999,
        'priority' => 'low',
    ]);

    expect($response->isError())->toBeTrue();
    expect($response->content()->toArray()['text'])->toContain('Card not found: 999999.');
});

it('advertises description and due_at as nullable in its schema', function (): void {
    $schema = app(UpdateCardTool::class)->toArray()['inputSchema'];

    expect($schema['properties']['description']['type'])->toBe(['string', 'null']);
    expect($schema['properties']['due_at']['type'])->toBe(['string', 'null']);
    expect($schema['properties']['title']['type'])->toBe('string');
    expect($schema['properties']['priority']['enum'])->toBe(['low', 'medium', 'high', 'urgent', 'none']);
});
