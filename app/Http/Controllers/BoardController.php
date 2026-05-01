<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Models\Board;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BoardController extends Controller
{
    public function store(StoreBoardRequest $request): RedirectResponse
    {
        $project = $request->project_id ? Project::findOrFail($request->project_id) : null;

        if ($project) {
            $this->authorize('update', $project);
        }

        $board = Board::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'slug' => Str::slug($request->name).'-'.Str::random(6),
        ]);

        $board->members()->create([
            'user_id' => $request->user()->id,
            'role' => 'admin',
        ]);

        // Create default lists
        $defaultLists = ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'];
        foreach ($defaultLists as $index => $name) {
            $board->lists()->create(['name' => $name, 'position' => $index]);
        }

        // Create default labels
        $defaultLabels = [
            ['name' => 'Bug', 'color' => '#ef4444'],
            ['name' => 'Feature', 'color' => '#3b82f6'],
            ['name' => 'Urgent', 'color' => '#f59e0b'],
            ['name' => 'Frontend', 'color' => '#8b5cf6'],
            ['name' => 'Backend', 'color' => '#10b981'],
        ];
        foreach ($defaultLabels as $label) {
            $board->labels()->create($label);
        }

        return redirect()->route('boards.show', $board);
    }

    public function show(Board $board): Response
    {
        $this->authorize('view', $board);

        $board->load([
            'project',
            'owner',
            'members.user',
            'labels',
            'discordWebhook',
            'githubRepositories',
            'lists' => fn ($q) => $q->whereNull('archived_at')->orderBy('position')->with([
                'cards' => fn ($q) => $q->whereNull('archived_at')->orderBy('position')->with([
                    'assignees',
                    'labels',
                    'attachments',
                    'githubLink',
                    'checklists.items',
                    'comments.user',
                    'creator',
                ]),
            ]),
        ]);

        $githubAccounts = auth()->user()->githubAccounts()
            ->whereNull('revoked_at')
            ->with('repositories')
            ->get();

        return Inertia::render('boards/show', [
            'board' => $board,
            'githubAccounts' => $githubAccounts,
        ]);
    }

    public function report(Board $board): Response
    {
        $this->authorize('view', $board);

        $board->load('labels', 'lists');

        $cards = $board->cards()
            ->whereNull('archived_at')
            ->with(['list', 'labels', 'assignees', 'attachments'])
            ->get();

        return Inertia::render('boards/report', [
            'board' => $board,
            'cards' => $cards,
        ]);
    }

    public function update(UpdateBoardRequest $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $board->update($request->validated());

        return back();
    }

    public function destroy(Board $board): RedirectResponse
    {
        $this->authorize('delete', $board);

        $board->update(['archived_at' => now()]);

        return $board->project_id
            ? redirect()->route('projects.show', $board->project)
            : redirect()->route('dashboard');
    }
}
