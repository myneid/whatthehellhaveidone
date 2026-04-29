<?php

namespace App\Http\Controllers;

use App\Jobs\ProcessTrelloImport;
use App\Models\Board;
use App\Models\TrelloImport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TrelloImportController extends Controller
{
    public function store(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'file' => ['required', 'file', 'mimetypes:application/json,text/plain', 'max:10240'],
        ]);

        $json = file_get_contents($request->file('file')->getRealPath());
        $data = json_decode($json, true);

        if (! $data || ! isset($data['name'])) {
            return back()->withErrors(['Invalid Trello export file.']);
        }

        $import = TrelloImport::create([
            'user_id' => $request->user()->id,
            'board_id' => $board->id,
            'source_board_id' => $data['id'] ?? null,
            'source_board_name' => $data['name'] ?? null,
            'status' => 'pending',
            'filename' => $request->file('file')->getClientOriginalName(),
        ]);

        // Store JSON for processing
        $path = "trello-imports/{$import->id}.json";
        \Illuminate\Support\Facades\Storage::put($path, $json);

        ProcessTrelloImport::dispatch($import, $path);

        return redirect()->route('boards.import.show', [$board, $import])
            ->with('success', 'Trello import queued.');
    }

    public function show(Board $board, TrelloImport $trelloImport): Response
    {
        $this->authorize('view', $board);

        return Inertia::render('boards/import-status', [
            'board' => $board,
            'import' => $trelloImport,
        ]);
    }
}
