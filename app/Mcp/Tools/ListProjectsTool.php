<?php

namespace App\Mcp\Tools;

use App\Models\Project;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('List all projects accessible to the authenticated user.')]
class ListProjectsTool extends Tool
{
    public function handle(Request $request): Response
    {
        $user = $request->user();

        $projects = Project::whereHas('members', fn ($q) => $q->where('user_id', $user->id))
            ->orWhere('owner_id', $user->id)
            ->active()
            ->withCount(['boards', 'members'])
            ->get(['id', 'name', 'slug', 'description', 'created_at']);

        return Response::text($projects->toJson(JSON_PRETTY_PRINT));
    }
}
