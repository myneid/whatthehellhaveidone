<?php

namespace App\Mcp\Tools;

use App\Models\Card;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get a card by ID with full details including comments, labels, checklists and GitHub link.')]
class GetCardTool extends Tool
{
    public function handle(Request $request): Response
    {
        $request->validate(['card_id' => ['required', 'integer']]);

        $card = Card::with([
            'list:id,name',
            'assignees:id,name',
            'labels:id,name,color',
            'comments.user:id,name',
            'checklists.items',
            'githubLink',
        ])->findOrFail($request->input('card_id'));

        $user = $request->user();

        if (! $user->can('view', $card)) {
            return Response::error('Permission denied.');
        }

        return Response::text($card->toJson(JSON_PRETTY_PRINT));
    }
}
