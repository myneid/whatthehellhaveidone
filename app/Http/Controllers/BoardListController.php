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

    public function update(Request $request, BoardList $list): RedirectResponse|JsonResponse
    {
        $this->authorize('update', $list->board);

        $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'position' => ['sometimes', 'integer', 'min:1'],
            'wip_limit' => ['nullable', 'integer', 'min:1'],
        ]);

        $attributes = $request->only(['name', 'wip_limit']);

        if ($request->has('position')) {
            $board = $list->board;
            $position = (int) $request->integer('position');
            $maxPosition = $board->lists()->whereNull('archived_at')->count();
            $targetPosition = max(1, min($position, $maxPosition));

            DB::transaction(function () use ($board, $list, $targetPosition, $attributes): void {
                $remainingLists = $board->lists()
                    ->whereNull('archived_at')
                    ->whereKeyNot($list->id)
                    ->orderBy('position')
                    ->get();

                $nextPosition = 1;
                foreach ($remainingLists as $remainingList) {
                    if ($nextPosition === $targetPosition) {
                        $nextPosition++;
                    }

                    $remainingList->update(['position' => $nextPosition]);
                    $nextPosition++;
                }

                $list->update([
                    ...$attributes,
                    'position' => $targetPosition,
                ]);
            });
        } else {
            $list->update($attributes);
        }

        if ($request->wantsJson()) {
            return response()->json(['list' => $list->fresh()]);
        }

        return back();
    }

    public function destroy(BoardList $list): RedirectResponse
    {
        $this->authorize('update', $list->board);

        DB::transaction(function () use ($list): void {
            $board = $list->board;
            $list->update(['archived_at' => now()]);

            $activeLists = $board->lists()->whereNull('archived_at')->orderBy('position')->get();
            foreach ($activeLists as $index => $list) {
                $list->update(['position' => $index + 1]);
            }
        });

        return back();
    }
}
