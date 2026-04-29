<?php

namespace App\Mcp\Tools;

use App\Models\Project;
use App\Models\ProjectDocument;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('List documents in a project. Provide project_id. Optionally filter by folder_id or search by title.')]
class ListDocumentsTool extends Tool
{
    public function handle(Request $request): Response
    {
        $request->validate(['project_id' => ['required', 'integer']]);

        $project = Project::findOrFail($request->get('project_id'));
        $user = $request->user();

        if (! $user->can('view', $project)) {
            return Response::error('Permission denied.');
        }

        $documents = ProjectDocument::where('project_id', $project->id)
            ->whereNull('archived_at')
            ->when($request->get('folder_id'), fn ($q, $id) => $q->where('document_folder_id', $id))
            ->when($request->get('search'), fn ($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->with(['folder:id,name', 'creator:id,name'])
            ->get(['id', 'title', 'slug', 'document_folder_id', 'creator_id', 'created_at', 'updated_at']);

        return Response::text($documents->toJson(JSON_PRETTY_PRINT));
    }
}
