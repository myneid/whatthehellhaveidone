<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Label;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LabelController extends Controller
{
    public function store(Request $request, Board $board): RedirectResponse
    {
        $this->authorize('update', $board);

        $request->validate([
            'name' => ['required', 'string', 'max:100'],
            'color' => ['required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $board->labels()->create($request->only(['name', 'color', 'description']));

        return back();
    }

    public function update(Request $request, Label $label): RedirectResponse
    {
        $this->authorize('update', $label->board);

        $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:100'],
            'color' => ['sometimes', 'required', 'string', 'regex:/^#[0-9a-fA-F]{6}$/'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        $label->update($request->only(['name', 'color', 'description']));

        return back();
    }

    public function destroy(Label $label): RedirectResponse
    {
        $this->authorize('update', $label->board);
        $label->delete();

        return back();
    }

    public function attach(Request $request, \App\Models\Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $request->validate(['label_id' => ['required', 'exists:labels,id']]);

        $card->labels()->syncWithoutDetaching([$request->label_id]);

        return back();
    }

    public function detach(Request $request, \App\Models\Card $card, Label $label): RedirectResponse
    {
        $this->authorize('update', $card);
        $card->labels()->detach($label->id);

        return back();
    }
}
