<?php

namespace App\Mcp\Tools;

use App\Models\BoardList;
use App\Models\Card;
use App\Services\WorkLogService;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Create a new card in a board list. Requires list_id and title.')]
class CreateCardTool extends Tool
{
    public function __construct(private readonly WorkLogService $workLogService) {}

    public function handle(Request $request): Response
    {
        $request->validate([
            'list_id' => ['required', 'integer'],
            'title' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'priority' => ['nullable', 'in:low,medium,high,urgent'],
        ]);

        $list = BoardList::findOrFail($request->get('list_id'));
        $user = $request->user();

        if (! $user->can('update', $list->board)) {
            return Response::error('Permission denied.');
        }

        $position = Card::where('list_id', $list->id)->whereNull('archived_at')->max('position') ?? 0;

        $card = Card::create([
            'board_id' => $list->board_id,
            'list_id' => $list->id,
            'creator_id' => $user->id,
            'title' => $request->get('title'),
            'description' => $request->get('description'),
            'priority' => $request->get('priority', 'medium'),
            'position' => $position + 1,
        ]);

        $this->workLogService->logCardCreated($card, $user);

        return Response::text("Card created: {$card->id} - {$card->title}");
    }
}
