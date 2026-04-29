<?php

namespace App\Mcp\Tools;

use App\Models\Board;
use App\Models\Card;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('List cards in a board. Filter by list_id, priority, or assignee_id.')]
class ListCardsTool extends Tool
{
    public function handle(Request $request): Response
    {
        $request->validate(['board_id' => ['required', 'integer']]);

        $board = Board::findOrFail($request->get('board_id'));
        $user = $request->user();

        if (! $user->can('view', $board)) {
            return Response::error('Permission denied.');
        }

        $cards = Card::where('board_id', $board->id)
            ->whereNull('archived_at')
            ->when($request->get('list_id'), fn ($q, $id) => $q->where('list_id', $id))
            ->when($request->get('priority'), fn ($q, $p) => $q->where('priority', $p))
            ->with(['list:id,name', 'assignees:id,name', 'labels:id,name,color'])
            ->orderBy('position')
            ->get(['id', 'title', 'description', 'priority', 'due_at', 'completed_at', 'list_id', 'position']);

        return Response::text($cards->toJson(JSON_PRETTY_PRINT));
    }
}
