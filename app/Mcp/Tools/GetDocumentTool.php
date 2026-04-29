<?php

namespace App\Mcp\Tools;

use App\Models\ProjectDocument;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tool;

#[Description('Get a project document by ID. Returns title and full markdown content.')]
class GetDocumentTool extends Tool
{
    public function handle(Request $request): Response
    {
        $request->validate(['document_id' => ['required', 'integer']]);

        $document = ProjectDocument::with(['project', 'folder', 'creator'])->findOrFail($request->input('document_id'));
        $user = $request->user();

        if (! $user->can('view', $document->project)) {
            return Response::error('Permission denied.');
        }

        return Response::text($document->toJson(JSON_PRETTY_PRINT));
    }
}
