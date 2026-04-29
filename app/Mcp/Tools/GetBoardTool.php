<?php

namespace App\Mcp\Tools;

use App\Models\Board;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get a board with its lists and cards. Provide the board_id.')]
class GetBoardTool extends Tool
{
    public function handle(Request $request): Response
    {
        $request->validate(['board_id' => ['required', 'integer']]);

        $board = Board::findOrFail($request->input('board_id'));
        $user = $request->user();

        if (! $user->can('view', $board)) {
            return Response::error('Permission denied.');
        }

        $board->load([
            'lists' => fn ($q) => $q->whereNull('archived_at')->orderBy('position')->with([
                'cards' => fn ($q) => $q->whereNull('archived_at')->orderBy('position')->with(['assignees:id,name', 'labels:id,name,color']),
            ]),
        ]);

        return Response::text($board->toJson(JSON_PRETTY_PRINT));
    }
}
