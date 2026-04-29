<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\BoardList;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            'position' => ['sometimes', 'integer', 'min:1'],
            'wip_limit' => ['nullable', 'integer', 'min:1'],
        ]);

        $attributes = $request->only(['name', 'wip_limit']);

        if ($request->has('position')) {
            $board = $boardList->board;
            $position = (int) $request->integer('position');
            $maxPosition = $board->lists()->whereNull('archived_at')->count();
            $targetPosition = max(1, min($position, $maxPosition));

            DB::transaction(function () use ($board, $boardList, $targetPosition, $attributes): void {
                $remainingLists = $board->lists()
                    ->whereNull('archived_at')
                    ->whereKeyNot($boardList->id)
                    ->orderBy('position')
                    ->get();

                $nextPosition = 1;
                foreach ($remainingLists as $list) {
                    if ($nextPosition === $targetPosition) {
                        $nextPosition++;
                    }

                    $list->update(['position' => $nextPosition]);
                    $nextPosition++;
                }

                $boardList->update([
                    ...$attributes,
                    'position' => $targetPosition,
                ]);
            });
        } else {
            $boardList->update($attributes);
        }

        if ($request->wantsJson()) {
            return response()->json(['list' => $boardList->fresh()]);
        }

        return back();
    }

    public function destroy(BoardList $boardList): RedirectResponse
    {
        $this->authorize('update', $boardList->board);

        DB::transaction(function () use ($boardList): void {
            $board = $boardList->board;
            $boardList->update(['archived_at' => now()]);

            $activeLists = $board->lists()->whereNull('archived_at')->orderBy('position')->get();
            foreach ($activeLists as $index => $list) {
                $list->update(['position' => $index + 1]);
            }
        });

        return back();
    }
}
