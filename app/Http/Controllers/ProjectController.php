<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $projects = $request->user()
            ->projects()
            ->with(['owner', 'boards' => fn ($q) => $q->where('archived_at', null)->withCount('cards')])
            ->withCount('members')
            ->active()
            ->latest()
            ->get();

        $standaloneBoards = $request->user()
            ->boards()
            ->whereNull('project_id')
            ->where('archived_at', null)
            ->withCount('cards')
            ->latest()
            ->get();

        return Inertia::render('dashboard', [
            'projects' => $projects,
            'standaloneBoards' => $standaloneBoards,
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $project = Project::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'slug' => Str::slug($request->name) . '-' . Str::random(6),
        ]);

        $project->members()->create([
            'user_id' => $request->user()->id,
            'role' => 'owner',
        ]);

        return redirect()->route('projects.show', $project);
    }

    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        $project->load([
            'owner',
            'members.user',
            'boards' => fn ($q) => $q->where('archived_at', null)->withCount('cards')->with('labels'),
        ]);

        return Inertia::render('projects/show', [
            'project' => $project,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return back();
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->update(['archived_at' => now()]);

        return redirect()->route('dashboard');
    }
}
