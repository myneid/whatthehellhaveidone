<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkLogEntryRequest;
use App\Models\WorkLogEntry;
use App\Services\WorkLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class WorkLogController extends Controller
{
    public function __construct(private readonly WorkLogService $workLogService) {}

    public function index(Request $request): InertiaResponse
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

        return Inertia::render('work-log/index', [
            'entries' => $query->paginate(50)->withQueryString(),
            'filters' => $request->only(['search', 'project_id', 'board_id', 'source', 'entry_type', 'date_from', 'date_to']),
        ]);
    }

    public function store(StoreWorkLogEntryRequest $request): RedirectResponse
    {
        $this->workLogService->logFromHashtags(
            $request->body,
            $request->user(),
            $request->only(['project_id', 'board_id', 'card_id', 'source', 'started_at', 'ended_at', 'duration_seconds', 'reference_url', 'metadata']),
        );

        return back();
    }

    public function update(Request $request, WorkLogEntry $workLogEntry): RedirectResponse
    {
        abort_if($workLogEntry->user_id !== $request->user()->id, 403);

        $request->validate(['body' => ['required', 'string']]);
        $workLogEntry->update(['body' => $request->body]);

        return back();
    }

    public function destroy(WorkLogEntry $workLogEntry): RedirectResponse
    {
        abort_if($workLogEntry->user_id !== auth()->id(), 403);
        $workLogEntry->delete();

        return back();
    }

    public function export(Request $request): Response
    {
        $entries = WorkLogEntry::where('user_id', $request->user()->id)
            ->with(['project', 'board', 'card'])
            ->when($request->date_from, fn ($q) => $q->whereDate('created_at', '>=', $request->date_from))
            ->when($request->date_to, fn ($q) => $q->whereDate('created_at', '<=', $request->date_to))
            ->latest()
            ->get();

        $format = $request->format ?? 'json';

        if ($format === 'csv') {
            $csv = "id,date,body,source,entry_type,project,board,card\n";
            foreach ($entries as $entry) {
                $csv .= implode(',', [
                    $entry->id,
                    $entry->created_at->toDateTimeString(),
                    '"' . str_replace('"', '""', $entry->body) . '"',
                    $entry->source,
                    $entry->entry_type,
                    $entry->project?->name ?? '',
                    $entry->board?->name ?? '',
                    $entry->card?->title ?? '',
                ]) . "\n";
            }

            return response($csv)
                ->header('Content-Type', 'text/csv')
                ->header('Content-Disposition', 'attachment; filename="work-log-' . now()->format('Y-m-d') . '.csv"');
        }

        return response(json_encode($entries->toArray(), JSON_PRETTY_PRINT))
            ->header('Content-Type', 'application/json')
            ->header('Content-Disposition', 'attachment; filename="work-log-' . now()->format('Y-m-d') . '.json"');
    }
}
