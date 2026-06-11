<?php

namespace App\Services;

use App\Events\CardMoved;
use App\Models\Board;
use App\Models\BoardList;
use App\Models\Card;

class CardListMoveService
{
    public function __construct(private readonly ActivityLogService $activityLog) {}

    public function resolveDoneList(Board $board): ?BoardList
    {
        $board->loadMissing('doneList');

        if ($board->doneList && $board->doneList->archived_at === null) {
            return $board->doneList;
        }

        return $board->lists()
            ->whereNull('archived_at')
            ->where('name', 'Done')
            ->orderBy('position')
            ->first();
    }

    public function moveCardToDoneList(Card $card, string $source, ?string $actorName = 'GitHub'): bool
    {
        $card->loadMissing('board');

        if (! $card->board) {
            return false;
        }

        $targetList = $this->resolveDoneList($card->board);

        if (! $targetList) {
            return false;
        }

        return $this->moveCardToList($card, $targetList, $source, $actorName);
    }

    public function moveCardToList(
        Card $card,
        BoardList $targetList,
        string $source,
        ?string $actorName = 'GitHub',
    ): bool {
        $card->loadMissing('board');
        $board = $card->board;

        if (! $board || $targetList->board_id !== $board->id || $targetList->archived_at || $card->list_id === $targetList->id) {
            return false;
        }

        $oldListId = $card->list_id;
        $nextPosition = ((Card::query()
            ->where('list_id', '=', $targetList->id)
            ->where('archived_at', '=', null)
            ->orderByDesc('position')
            ->value('position')) ?? 0) + 1;

        $card->update([
            'list_id' => $targetList->id,
            'position' => $nextPosition,
        ]);

        $this->activityLog->log(
            $card,
            'card_moved',
            old: ['list_id' => $oldListId],
            new: ['list_id' => $targetList->id, 'position' => $nextPosition],
            metadata: ['source' => $source],
        );

        event(new CardMoved($card, $oldListId, actorName: $actorName));

        return true;
    }
}
