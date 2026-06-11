<?php

namespace App\Http\Controllers;

use App\Events\CardCommented;
use App\Models\Card;
use App\Models\CardComment;
use App\Services\ActivityLogService;
use App\Services\MentionService;
use App\Services\WorkLogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CardCommentController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLog,
        private readonly WorkLogService $workLog,
        private readonly MentionService $mentionService,
    ) {}

    public function store(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $validated = $request->validate([
            'body' => ['required', 'string'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::exists('card_comments', 'id')->where('card_id', $card->id),
            ],
        ]);

        $comment = $card->comments()->create([
            'parent_id' => $validated['parent_id'] ?? null,
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        $this->activityLog->log($card, 'comment_added', new: ['comment_id' => $comment->id], actor: $request->user());

        $this->mentionService->notifyMentions($card, $request->user(), $comment->body, 'comment');

        event(new CardCommented($card, $comment));

        return back();
    }

    public function update(Request $request, CardComment $comment): RedirectResponse
    {
        $this->authorize('update', $comment->card);

        if ($comment->user_id !== $request->user()->id) {
            abort(403);
        }

        $request->validate(['body' => ['required', 'string']]);
        $comment->update(['body' => $request->body]);

        return back();
    }

    public function destroy(CardComment $comment): RedirectResponse
    {
        $this->authorize('update', $comment->card);

        if ($comment->user_id !== auth()->id() && ! auth()->user()->is_super_admin) {
            abort(403);
        }

        $comment->delete();

        return back();
    }
}
