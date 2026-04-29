<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BoardListController extends Controller
{
    public function store(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $position = $board->lists()->whereNull('archived_at')->max('position') ?? 0;
        $board->lists()->create(['name' => $request->name, 'position' => $position + 1]);

        return back();
    }

    public function update(Request $request, BoardList $boardList): RedirectResponse|JsonResponse
    {
        $this->authorize('update', $boardList->board);

        $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'integer', 'min:0'],
            'wip_limit' => ['nullable', 'integer', 'min:1'],
        ]);

        $boardList->update($request->only(['name', 'position', 'wip_limit']));

        if ($request->wantsJson()) {
            return response()->json(['list' => $boardList->fresh()]);
        }

        return back();
    }

    public function destroy(BoardList $boardList): RedirectResponse
    {
        $this->authorize('update', $boardList->board);

        $boardList->update(['archived_at' => now()]);

        return back();
    }
}
