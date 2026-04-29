<?php

namespace App\Mcp\Tools;

use App\Models\Card;
use App\Models\BoardList;
use App\Services\WorkLogService;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Move a card to a different list. Provide card_id and list_id.')]
class MoveCardTool extends Tool
{
    public function __construct(private readonly WorkLogService $workLogService) {}

    public function handle(Request $request): Response
    {
        $request->validate([
            'card_id' => ['required', 'integer'],
            'list_id' => ['required', 'integer'],
        ]);

        $card = Card::findOrFail($request->input('card_id'));
        $list = BoardList::findOrFail($request->input('list_id'));
        $user = $request->user();

        if (! $user->can('update', $card)) {
            return Response::error('Permission denied.');
        }

        $oldListId = $card->list_id;
        $position = Card::where('list_id', $list->id)->whereNull('archived_at')->max('position') ?? 0;

        $card->update([
            'list_id' => $list->id,
            'position' => $position + 1,
        ]);

        $this->workLogService->logCardMoved($card, $oldListId, $user);

        return Response::text("Card moved to '{$list->name}'.");
    }
}
