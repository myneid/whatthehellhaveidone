<?php

namespace App\Http\Controllers;

use App\Events\CardCreated;
use App\Events\CardMoved;
use App\Http\Requests\MoveCardRequest;
use App\Http\Requests\StoreCardRequest;
use App\Http\Requests\UpdateCardRequest;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\WorkLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CardController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLog,
        private readonly WorkLogService $workLog,
    ) {}

    public function store(StoreCardRequest $request): RedirectResponse
    {
        $list = BoardList::findOrFail($request->list_id);
        $this->authorize('update', $list->board);

        $position = Card::where('list_id', $list->id)->whereNull('archived_at')->max('position') ?? 0;

        $card = Card::create([
            ...$request->validated(),
            'board_id' => $list->board_id,
            'creator_id' => $request->user()->id,
            'position' => $position + 1,
        ]);

        $this->activityLog->log($card, 'card_created', actor: $request->user());
        $this->workLog->logCardCreated($card, $request->user());

        event(new CardCreated($card));

        return back();
    }

    public function show(Card $card): Response
    {
        $this->authorize('view', $card);

        $card->load([
            'list',
            'creator',
            'assignees',
            'labels',
            'comments.user',
            'attachments.user',
            'checklists.items.completedBy',
            'watchers',
            'githubLink.githubRepository',
            'activityLogs.actor',
        ]);

        return Inertia::render('cards/show', [
            'card' => $card,
            'board' => $card->board->load(['lists', 'labels', 'members.user']),
        ]);
    }

    public function update(UpdateCardRequest $request, Card $card): RedirectResponse|JsonResponse
    {
        $this->authorize('update', $card);

        $oldValues = $card->only(['title', 'description', 'priority', 'due_at']);
        $card->update($request->validated());

        $this->activityLog->log($card, 'card_updated', old: $oldValues, new: $card->fresh()->only(array_keys($oldValues)), actor: $request->user());

        if ($request->wantsJson()) {
            return response()->json(['card' => $card->fresh()]);
        }

        return back();
    }

    public function move(MoveCardRequest $request, Card $card): JsonResponse
    {
        $this->authorize('update', $card);

        $oldListId = $card->list_id;
        $oldPosition = $card->position;

        $card->update([
            'list_id' => $request->list_id,
            'position' => $request->position,
        ]);

        $this->activityLog->log($card, 'card_moved', old: ['list_id' => $oldListId, 'position' => $oldPosition], new: ['list_id' => $card->list_id, 'position' => $card->position], actor: $request->user());
        $this->workLog->logCardMoved($card, $oldListId, $request->user());

        event(new CardMoved($card, $oldListId));

        return response()->json(['success' => true]);
    }

    public function archive(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $card->update(['archived_at' => now()]);
        $this->activityLog->log($card, 'card_archived', actor: $request->user());

        return back();
    }

    public function restore(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $card->update(['archived_at' => null]);
        $this->activityLog->log($card, 'card_restored', actor: $request->user());

        return back();
    }

    public function assign(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('update', $card);

        $request->validate(['user_id' => ['required', 'exists:users,id']]);

        $card->assignments()->firstOrCreate([
            'user_id' => $request->user_id,
            'assigned_by' => $request->user()->id,
        ]);

        $this->activityLog->log($card, 'user_assigned', new: ['user_id' => $request->user_id], actor: $request->user());

        return back();
    }

    public function unassign(Request $request, Card $card, User $user): RedirectResponse
    {
        $this->authorize('update', $card);

        $card->assignments()->where('user_id', $user->id)->delete();
        $this->activityLog->log($card, 'user_unassigned', new: ['user_id' => $user->id], actor: $request->user());

        return back();
    }

    public function watch(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('view', $card);
        $card->watchers()->syncWithoutDetaching([$request->user()->id]);

        return back();
    }

    public function unwatch(Request $request, Card $card): RedirectResponse
    {
        $this->authorize('view', $card);
        $card->watchers()->detach($request->user()->id);

        return back();
    }

    public function destroy(Card $card): RedirectResponse
    {
        $this->authorize('delete', $card);
        $card->delete();

        return back();
    }
}
