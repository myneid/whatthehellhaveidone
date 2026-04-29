<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WorkLogEntry;
use App\Services\WorkLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkLogApiController extends Controller
{
    public function __construct(private readonly WorkLogService $workLogService) {}

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'body' => ['required', 'string', 'max:5000'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'board_id' => ['nullable', 'exists:boards,id'],
            'card_id' => ['nullable', 'exists:cards,id'],
            'source' => ['nullable', 'string'],
            'started_at' => ['nullable', 'date'],
            'ended_at' => ['nullable', 'date'],
            'duration_seconds' => ['nullable', 'integer'],
            'reference_url' => ['nullable', 'url'],
            'metadata' => ['nullable', 'array'],
        ]);

        $entry = $this->workLogService->logFromHashtags(
            $request->body,
            $request->user(),
            $request->only(['project_id', 'board_id', 'card_id', 'source', 'started_at', 'ended_at', 'duration_seconds', 'reference_url', 'metadata']),
        );

        return response()->json(['entry' => $entry->load(['project', 'board', 'card'])], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $entries = WorkLogEntry::where('user_id', $request->user()->id)
            ->with(['project', 'board', 'card'])
            ->when($request->date, fn ($q) => $q->whereDate('created_at', $request->date))
            ->latest()
            ->paginate(50);

        return response()->json($entries);
    }

    public function export(Request $request): JsonResponse
    {
        $entries = WorkLogEntry::where('user_id', $request->user()->id)
            ->when($request->date_from, fn ($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->date_to, fn ($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->latest()
            ->get();

        return response()->json($entries);
    }
}
