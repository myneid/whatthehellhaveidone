<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\ChecklistResource;
use App\Models\Card;
use App\Models\Checklist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChecklistController extends Controller
{
    public function store(Request $request, Card $card): JsonResponse
    {
        $this->authorize('update', $card);

        $request->validate(['name' => ['required', 'string', 'max:255']]);

        $position = $card->checklists()->max('position') ?? 0;
        $checklist = $card->checklists()->create([
            'name' => $request->name,
            'position' => $position + 1,
        ]);

        return response()->json([
            'message' => 'Checklist created successfully.',
            'checklist' => new ChecklistResource($checklist),
        ], 201);
    }

    public function update(Request $request, Checklist $checklist): JsonResponse
    {
        $this->authorize('update', $checklist->card);

        $request->validate(['name' => ['required', 'string', 'max:255']]);
        $checklist->update(['name' => $request->name]);

        return response()->json([
            'message' => 'Checklist updated successfully.',
            'checklist' => new ChecklistResource($checklist),
        ]);
    }

    public function destroy(Checklist $checklist): JsonResponse
    {
        $this->authorize('update', $checklist->card);
        $checklist->delete();

        return response()->json(['message' => 'Checklist removed successfully.']);
    }
}
