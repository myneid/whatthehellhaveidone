<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
    use App\Http\Resources\Api\ProjectResource;
use App\Models\Project;
use App\Services\ProjectInvitationReconciliationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectInvitationReconciliationService $invitationReconciliation,
    ) {}

    public function index(Request $request): JsonResponse
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

        return response()->json([
            'projects' => ProjectResource::collection($projects),
            'standaloneBoards' => $standaloneBoards, // Or create a BoardResource collection for these too
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $project = Project::create([
            ...$request->validated(),
            'owner_id' => $request->user()->id,
            'slug' => Str::slug($request->name).'-'.Str::random(6),
        ]);

        $project->members()->create([
            'user_id' => $request->user()->id,
            'role' => 'owner',
        ]);

        return response()->json([
            'message' => 'Project created successfully.',
            'project' => new ProjectResource($project),
        ], 201);
    }

    public function show(Project $project): JsonResponse
    {
        $this->authorize('view', $project);

        $this->invitationReconciliation->reconcile($project);

        $project->load([
            'owner',
            'members.user',
            'invitations' => fn ($query) => $query
                ->whereNull('accepted_at')
                ->with('invitedBy')
                ->latest(),
            'boards' => fn ($q) => $q->where('archived_at', null)->withCount('cards')->with('labels'),
        ]);

        return response()->json($project);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return response()->json([
            'message' => 'Project updated successfully.',
            'project' => new ProjectResource($project),
        ]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $project->update(['archived_at' => now()]);

        return response()->json(['message' => 'Project archived successfully.']);
    }
}
