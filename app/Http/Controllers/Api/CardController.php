<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\CardResource;
use App\Models\BoardList;
use App\Models\Card;
use App\Models\User;
use App\Services\ActivityLogService;
use App\Services\GithubCardIssueService;
use App\Services\MentionService;
use App\Services\WorkLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use RuntimeException;

class CardController extends Controller
{
    public function __construct(
        private readonly ActivityLogService $activityLog,
        private readonly WorkLogService $workLog,
        private readonly MentionService $mentionService,
    ) {}

    public function store(
        Request $request,
        GithubCardIssueService $githubCardIssues,
    ): JsonResponse {
        $list = BoardList::findOrFail($request->list_id);
        $this->authorize('create', [Card::class, $list->board]);

        $position = Card::where('list_id', $list->id)->whereNull('archived_at')->max('position') ?? 0;

        $card = Card::create([
            ...$request->validated(),
            'board_id' => $list->board_id,
            'creator_id' => $request->user()->id,
            'position' => $position + 1,
        ]);

        $this->activityLog->log($card, 'card_created', actor: $request->user());
        $this->workLog->logCardCreated($card, $request->user());

        if ($request->boolean('create_github_issue')) {
            try {
                $link = $githubCardIssues->ensureIssueForCardOrFail(
                    $card,
                    $request->integer('github_repository_id') ?: null,
                );

                // In API, we might want to return the github link in the response
                $card->setAttribute('github_issue_link', $link->issue_number);
            } catch (RuntimeException $exception) {
                // Log error but don't fail the request
            }
        }

        return response()->json([
            'message' => 'Card created successfully.',
            'card' => new CardResource($card),
        ], 201);
    }

    public function show(Card $card): JsonResponse
    {
        $this->authorize('view', $card);

        return response()->json(new CardResource($card->load([
            'assignees',
            'labels',
            'attachments',
            'checklists.items',
            'comments.user',
            'creator',
            'mentionedUsers',
        ])));
    }

    public function update(Request $request, Card $card): JsonResponse
    {
        $this->authorize('update', $card);

        $oldValues = $card->only(['title', 'description', 'priority', 'due_at']);
        $card->update($request->validated());

        $this->activityLog->log($card, 'card_updated', old: $oldValues, new: $card->fresh()->only(array_keys($oldValues)), actor: $request->user());

        if (isset($request->validated()['description'])) {
            $this->mentionService->notifyMentions($card, $request->user(), $request->validated()['description'], 'description');
        }

        return response()->json([
            'message' => 'Card updated successfully.',
            'card' => new CardResource($card->fresh()),
        ]);
    }

    public function move(Request $request, Card $card): JsonResponse
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

        return response()->json(['success' => true]);
    }

    public function archive(Request $request, Card $card): JsonResponse
    {
        $this->authorize('update', $card);

        $card->update(['archived_at' => now()]);
        $this->activityLog->log($card, 'card_archived', actor: $request->user());

        return response()->json(['message' => 'Card archived successfully.']);
    }

    public function restore(Request $request, Card $card): JsonResponse
    {
        $this->authorize('update', $card);

        $card->update(['archived_at' => null]);
        $this->activitylog->log($card, 'card_restored', actor: $request->user());

        return response()->json(['message' => 'Card restored successfully.']);
    }

    public function assign(Request $request, Card $card): JsonResponse
    {
        $this->authorize('update', $card);

        $request->validate(['user_id' => ['required', 'exists:users,id']]);

        $card->loadMissing('board');

        $assignee = User::query()->findOrFail($request->user_id);

        if (! $card->board->canAssignWorkTo($assignee)) {
            return response()->json(['message' => 'That user cannot be assigned work on this board.'], 422);
        }

        $card->assignments()->firstOrCreate([
            'user_id' => $request->user_id,
            'assigned_by' => $request->user()->id,
        ]);

        $this->activityLog->log($card, 'user_assigned', new: ['user_id' => $request->user_id], actor: $request->user());

        return response()->json(['message' => 'User assigned to card successfully.']);
    }

    public function unassign(Request $request, Card $card, User $user): JsonResponse
    {
        $this->authorize('update', $card);

        $card->assignments()->where('user_id', $user->id)->delete();
        $this->activityLog->log($card, 'user_unassigned', new: ['user_id' => $user->id], actor: $request->user());

        return response()->json(['message' => 'User unassigned from card successfully.']);
    }

    public function watch(Request $request, Card $card): JsonResponse
    {
        $this->authorize('view', $card);
        $card->watchers()->syncWithoutDetaching([$request->user()->id]);

        return response()->json(['message' => 'You are now watching this card.']);
    }

    public function unwatch(Request $request, Card $card): JsonResponse
    {
        $this->authorize('view', $card);
        $card->watchers()->detach($request->user()->id);

        return response()->json(['message' => 'You have stopped watching this card.']);
    }

    public function destroy(Card $card): JsonResponse
    {
        $this->authorize('delete', $card);
        $card->delete();

        return response()->json(['message' => 'Card deleted successfully.']);
    }
}
