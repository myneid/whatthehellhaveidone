<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\WorkLogEntryResource;
use App\Models\WorkLogEntry;
use App\Services\WorkLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkLogController extends Controller
{
    public function __construct(private readonly WorkLogService $workLogService) {}

    public function index(Request $request): JsonResponse
    {
        $query = WorkLogEntry::where('user_id', $request->user()->id)
            ->with(['project', 'board', 'card'])
            ->when($request->search, fn ($q) => $q->where('body', 'like', "%{$request->search}%"))
            ->when($request->project_id, fn ($q) => $q->where('project_id', $request->project_id))
            ->when($request->board_id, fn ($q) => $q->where('board_id', $request->board_id))
            ->when($request->source, fn ($q) => $q->where('source', $request->source))
            ->when($request->entry_type, fn ($q) => $q->where('entry_type', $request->entry_type))
            ->when($request->date_from, fn ($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->date_to, fn ($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->latest();

        return response()->json([
            'entries' => WorkLogEntryResource::collection($query->paginate(50)->withQueryString()),
            'filters' => $request->only(['search', 'project_id', 'board_id', 'source', 'entry_type', 'date_from', 'date_to']),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $this->workLogService->logFromHashtags(
            $request->body,
            $request->user(),
            $request->only(['project_id', 'board_id', 'card_id', 'source', 'started_at', 'ended_at', 'duration_seconds', 'reference_url', 'metadata']),
        );

        return response()->json(['message' => 'Work log entry created successfully.'], 201);
    }

    public function update(Request $request, WorkLogEntry $workLogEntry): JsonResponse
    {
        abort_if($workLogEntry->user_id !== $request->user()->id, 403);

        $validated = $request->validated();

        $this->workLogService->updateEntryFromHashtags(
            $workLogEntry,
            $validated['body'],
            collect($validated)
                ->except(['body'])
                ->all(),
        );

        return response()->json([
            'message' => 'Work log entry updated successfully.',
            'entry' => new WorkLogEntryResource($workLogEntry->fresh()),
        ]);
    }

    public function destroy(WorkLogEntry $workLogEntry): JsonResponse
    {
        abort_if($workLogEntry->user_id !== auth()->id(), 403);
        $workLogEntry->delete();

        return response()->json(['message' => 'Work log entry deleted successfully.']);
    }
}
