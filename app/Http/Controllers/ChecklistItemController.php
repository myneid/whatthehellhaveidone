<?php

namespace App\Http\Controllers;

use App\Models\Checklist;
use App\Models\ChecklistItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ChecklistItemController extends Controller
{
    public function store(Request $request, Checklist $checklist): RedirectResponse
    {
        $this->authorize('update', $checklist->card);

        $request->validate(['name' => ['required', 'string', 'max:500']]);

        $position = $checklist->items()->max('position') ?? 0;
        $checklist->items()->create(['name' => $request->name, 'position' => $position + 1]);

        return back();
    }

    public function update(Request $request, ChecklistItem $checklistItem): RedirectResponse
    {
        $this->authorize('update', $checklistItem->checklist->card);

        $request->validate(['name' => ['sometimes', 'required', 'string', 'max:500']]);
        $checklistItem->update($request->only(['name']));

        return back();
    }

    public function toggle(Request $request, ChecklistItem $checklistItem): JsonResponse
    {
        $this->authorize('update', $checklistItem->checklist->card);

        $checklistItem->update([
            'is_completed' => ! $checklistItem->is_completed,
            'completed_by' => ! $checklistItem->is_completed ? $request->user()->id : null,
            'completed_at' => ! $checklistItem->is_completed ? now() : null,
        ]);

        return response()->json(['item' => $checklistItem->fresh()]);
    }

    public function destroy(ChecklistItem $checklistItem): RedirectResponse
    {
        $this->authorize('update', $checklistItem->checklist->card);
        $checklistItem->delete();

        return back();
    }
}
