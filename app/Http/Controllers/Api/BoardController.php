<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBoardRequest;
use App\Http\Requests\UpdateBoardRequest;
use App\Http\Resources\Api\BoardResource;
use App\Models\Board;
use App\Models\Project;
use App\Services\SyncProjectMembersToBoardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class BoardController extends Controller
{
    public function __construct(
        private readonly SyncProjectMembersToBoardService $syncProjectMembersToBoard,
    ) {}

    public function store(StoreBoardRequest $request): JsonResponse
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
        $copilotDoneListId = null;
        $doneListId = null;
        $todoListId = null;
        $workStartListId = null;

        foreach ($defaultLists as $index => $name) {
            $list = $board->lists()->create(['name' => $name, 'position' => $index]);

            if ($name === 'Review') {
                $copilotDoneListId = $list->id;
            }

            if ($name === 'Done') {
                $doneListId = $list->id;
            }

            if ($name === 'To Do') {
                $todoListId = $list->id;
            }

            if ($name === 'In Progress') {
                $workStartListId = $list->id;
            }
        }

        $board->update(array_filter([
            'copilot_done_list_id' => $copilotDoneListId,
            'done_list_id' => $doneListId,
            'todo_list_id' => $todoListId,
            'work_start_list_id' => $workStartListId,
        ]));

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

        if ($project) {
            $this->syncProjectMembersToBoard->sync($board);
        }

        return response()->json([
            'message' => 'Board created successfully.',
            'board' => new BoardResource($board->load(['lists.cards', 'labels', 'members.user'])),
        ], 201);
    }

    public function show(Board $board): JsonResponse
    {
        $this->authorize('view', $board);

        $this->syncProjectMembersToBoard->sync($board);

        $board->load([
            'project.members.user',
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
                    'mentionedUsers',
                ]),
            ]),
        ]);

        return response()->json([
            'board' => new BoardResource($board),
        ]);
    }

    public function update(UpdateBoardRequest $request, Board $board): JsonResponse
    {
        $this->authorize('update', $board);

        $board->update($request->validated());

        return response()->json([
            'message' => 'Board updated successfully.',
            'board' => new BoardResource($board->fresh()->load(['labels', 'lists.cards'])),
        ]);
    }

    public function destroy(Board $board): JsonResponse
    {
        $this->authorize('delete', $board);

        $board->update(['archived_at' => now()]);

        return response()->json([
            'message' => 'Board archived successfully.',
        ]);
    }
}
