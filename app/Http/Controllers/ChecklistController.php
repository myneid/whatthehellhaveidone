<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\Checklist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ChecklistController extends Controller
{
    public function store(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $request->validate(['name' => ['required', 'string', 'max:255']]);

        $position = $card->checklists()->max('position') ?? 0;
        $card->checklists()->create(['name' => $request->name, 'position' => $position + 1]);

        return back();
    }

    public function update(Request $request, Checklist $checklist): RedirectResponse
    {
        $this->authorize('update', $checklist->card);

        $request->validate(['name' => ['required', 'string', 'max:255']]);
        $checklist->update(['name' => $request->name]);

        return back();
    }

    public function destroy(Checklist $checklist): RedirectResponse
    {
        $this->authorize('update', $checklist->card);
        $checklist->delete();

        return back();
    }
}
