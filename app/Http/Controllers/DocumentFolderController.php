<?php

namespace App\Http\Controllers;

use App\Models\DocumentFolder;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class DocumentFolderController extends Controller
{
    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'parent_id' => ['nullable', 'exists:document_folders,id'],
        ]);

        $position = DocumentFolder::where('project_id', $project->id)
            ->where('parent_id', $request->parent_id)
            ->max('position') ?? 0;

        $project->documentFolders()->create([
            'name' => $request->name,
            'slug' => Str::slug($request->name) . '-' . Str::random(4),
            'parent_id' => $request->parent_id,
            'position' => $position + 1,
        ]);

        return back();
    }

    public function update(Request $request, DocumentFolder $documentFolder): RedirectResponse
    {
        $this->authorize('update', $documentFolder->project);

        $request->validate(['name' => ['required', 'string', 'max:255']]);
        $documentFolder->update(['name' => $request->name]);

        return back();
    }

    public function destroy(DocumentFolder $documentFolder): RedirectResponse
    {
        $this->authorize('update', $documentFolder->project);
        $documentFolder->update(['archived_at' => now()]);

        return back();
    }
}
