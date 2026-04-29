<?php

use App\Jobs\ProcessTrelloImport;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\TrelloImport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

it('matches imported row names case-insensitively to existing rows', function (): void {
    Storage::fake();

    $user = User::factory()->create();
    $board = Board::create([
        'owner_id' => $user->id,
        'name' => 'Import Target',
        'slug' => 'import-target-1',
        'visibility' => 'team',
    ]);

    $backlog = BoardList::create([
        'board_id' => $board->id,
        'name' => 'Backlog',
        'position' => 1,
    ]);

    $import = TrelloImport::create([
        'user_id' => $user->id,
        'board_id' => $board->id,
        'status' => 'pending',
        'filename' => 'trello.json',
    ]);

    $payload = [
        'id' => 'board-1',
        'name' => 'Imported Board',
        'labels' => [],
        'lists' => [
            ['id' => 'list-backlog', 'name' => 'backlog', 'pos' => 10, 'closed' => false],
        ],
        'cards' => [
            [
                'id' => 'card-1',
                'idList' => 'list-backlog',
                'name' => 'Imported card',
                'desc' => 'Card body',
                'pos' => 10,
                'closed' => false,
                'labels' => [],
                'idChecklists' => [],
                'due' => null,
                'dueComplete' => false,
            ],
        ],
        'checklists' => [],
    ];

    $path = "trello-imports/{$import->id}.json";
    Storage::put($path, json_encode($payload, JSON_THROW_ON_ERROR));

    (new ProcessTrelloImport($import, $path))->handle();

    expect(BoardList::where('board_id', $board->id)->whereNull('archived_at')->count())->toBe(1)
        ->and(Card::where('board_id', $board->id)->count())->toBe(1)
        ->and(Card::first()?->list_id)->toBe($backlog->id)
        ->and($import->fresh()->status)->toBe('completed');
});
