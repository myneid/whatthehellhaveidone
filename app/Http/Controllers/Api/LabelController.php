<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\LabelResource;
use App\Models\Board;
use App\Models\Label;
use App\Models\Card;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    public function store(Request $request, Board $board): JsonResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'color' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $label = $board->labels()->create($request->only(['name', 'color', 'description']));

        return response()->json([
            'message' => 'Label created successfully.',
            'label' => new LabelResource($label),
        ], 201);
    }

    public function update(Request $request, Label $label): JsonResponse
    {
        $this->authorize('update', $label->board);

        $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'color' => ['sometimes', 'required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $label->update($request->only(['name', 'color', 'description']));

        return response()->json([
            'message' => 'Label updated successfully.',
            'label' => new LabelResource($label),
        ]);
    }

    public function destroy(Label $label): JsonResponse
    {
        $this->authorize('update', $label->board);
        $label->delete();

        return response()->json(['message' => 'Label removed successfully.']);
    }

    public function attach(Request $request, Card $card): JsonResponse
    {
        $this->authorize('update', $card);

        $request->validate(['label_id' => ['required', 'exists:labels,id']]);

        $card->labels()->syncWithoutDetaching([$request->label_id]);

        return response()->json(['message' => 'Label attached to card successfully.']);
    }
}
