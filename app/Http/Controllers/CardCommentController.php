<?php

namespace App\Http\Controllers;

use App\Events\CardCommented;
use App\Models\Card;
use App\Models\CardComment;
use App\Services\ActivityLogService;
use App\Services\WorkLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CardCommentController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLog,
        private readonly WorkLogService $workLog,
    ) {}

    public function store(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $request->validate(['body' => ['required', 'string']]);

        $comment = $card->comments()->create([
            'user_id' => $request->user()->id,
            'body' => $request->body,
        ]);

        $this->activityLog->log($card, 'comment_added', new: ['comment_id' => $comment->id], actor: $request->user());

        event(new CardCommented($card, $comment));

        return back();
    }

    public function update(Request $request, CardComment $cardComment): RedirectResponse
    {
        $this->authorize('update', $cardComment->card);

        if ($cardComment->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate(['body' => ['required', 'string']]);
        $cardComment->update(['body' => $request->body]);

        return back();
    }

    public function destroy(CardComment $cardComment): RedirectResponse
    {
        $this->authorize('update', $cardComment->card);

        if ($cardComment->user_id !== auth()->id() && ! auth()->user()->is_super_admin) {
            abort(403);
        }

        $cardComment->delete();

        return back();
    }
}
