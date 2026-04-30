<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectDocument;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectDocumentController extends Controller
{
    public function index(Request $request, Project $project): Response
    {
        $this->authorize('view', $project);

        $documents = $project->documents()
            ->whereNull('archived_at')
            ->when($request->search, fn ($q) => $q->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                    ->orWhere('markdown_body', 'like', "%{$request->search}%");
            }))
            ->when($request->folder_id, fn ($q) => $q->where('document_folder_id', $request->folder_id))
            ->with(['folder', 'creator', 'lastEditor'])
            ->latest('updated_at')
            ->get();

        $folders = $project->documentFolders()->whereNull('archived_at')->whereNull('parent_id')->with('children')->orderBy('position')->get();

        return Inertia::render('projects/documents/index', [
            'project' => $project,
            'documents' => $documents,
            'folders' => $folders,
            'filters' => $request->only(['search', 'folder_id']),
        ]);
    }

    public function store(Request $request, Project $project): RedirectResponse
    {
        $this->authorize('view', $project);

        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'document_folder_id' => ['nullable', 'exists:document_folders,id'],
            'markdown_body' => ['nullable', 'string'],
        ]);

        $document = $project->documents()->create([
            ...$request->only(['title', 'document_folder_id', 'markdown_body']),
            'creator_id' => $request->user()->id,
            'slug' => Str::slug($request->title).'-'.Str::random(6),
        ]);

        return redirect()->route('documents.edit', $document);
    }

    public function show(ProjectDocument $document): Response
    {
        $this->authorize('view', $document->project);

        $document->load(['folder', 'creator', 'lastEditor']);

        return Inertia::render('projects/documents/show', [
            'document' => $document,
            'project' => $document->project,
        ]);
    }

    public function edit(ProjectDocument $document): Response
    {
        $this->authorize('view', $document->project);

        $document->load(['folder', 'project.documentFolders']);

        return Inertia::render('projects/documents/edit', [
            'document' => $document,
            'project' => $document->project,
        ]);
    }

    public function update(Request $request, ProjectDocument $document): RedirectResponse
    {
        $this->authorize('view', $document->project);

        $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'markdown_body' => ['nullable', 'string'],
            'document_folder_id' => ['nullable', 'exists:document_folders,id'],
        ]);

        $document->update([
            ...$request->only(['title', 'markdown_body', 'document_folder_id']),
            'last_editor_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Document saved.');
    }

    public function destroy(ProjectDocument $document): RedirectResponse
    {
        $this->authorize('update', $document->project);
        $document->update(['archived_at' => now()]);

        return redirect()->route('projects.documents.index', $document->project);
    }
}
