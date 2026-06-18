<?php

namespace App\Mcp\Tools;

use App\Models\Board;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('List all boards accessible to the authenticated user.')]
class ListBoardsTool extends Tool
{
    public function handle(Request $request): Response
    {
        $user = $request->user();

        $boards = Board::whereHas('members', fn ($q) => $q->where('user_id', $user->id))
            ->orWhere('owner_id', $user->id)
            ->active()
            ->withCount(['lists', 'cards'])
            ->get(['id', 'name', 'slug', 'description', 'created_at']);

        return Response::text($boards->toJson(JSON_PRETTY_PRINT));
    }
}
