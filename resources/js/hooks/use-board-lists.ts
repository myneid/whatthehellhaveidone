import { router } from '@inertiajs/react';
import { useCallback, useMemo, useState } from 'react';
import {
    buildBoardListSignature,
    listPromptsGithubIssue,
    listPromptsGithubIssueClose,
    listPromptsPullRequestAction,
    moveCardBetweenLists,
    normalizeLists,
    resolveDoneListId,
    resolveTodoListId,
    workAssignmentContext,
    type WorkAssignmentContext,
} from '@/lib/board-list-utils';
import * as cardRoutes from '@/routes/cards';
import * as listRoutes from '@/routes/lists';
import type { Board, BoardList, Card } from '@/types/app';

export function useBoardLists(board: Board) {
    const boardLists = useMemo(
        () => normalizeLists(board.lists ?? []),
        [board.lists],
    );
    const boardListSignature = useMemo(
        () => buildBoardListSignature(boardLists),
        [boardLists],
    );
    const [listsState, setListsState] = useState<{
        signature: string;
        items: BoardList[];
    }>({
        signature: boardListSignature,
        items: boardLists,
    });
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [movingCardId, setMovingCardId] = useState<number | null>(null);
    const [pendingWorkAssignmentCardId, setPendingWorkAssignmentCardId] =
        useState<number | null>(null);
    const [pendingWorkAssignmentContext, setPendingWorkAssignmentContext] =
        useState<WorkAssignmentContext | null>(null);
    const [pendingPullRequestActionCardId, setPendingPullRequestActionCardId] =
        useState<number | null>(null);
    const [pendingGithubIssueCloseCardId, setPendingGithubIssueCloseCardId] =
        useState<number | null>(null);
    const [pendingGithubIssueCardId, setPendingGithubIssueCardId] =
        useState<number | null>(null);

    const lists =
        listsState.signature === boardListSignature
            ? listsState.items
            : boardLists;

    const selectedCard = useMemo(
        () =>
            selectedCardId === null
                ? null
                : (lists
                      .flatMap((list) => list.cards ?? [])
                      .find((card) => card.id === selectedCardId) ?? null),
        [lists, selectedCardId],
    );

    const pendingWorkAssignmentCard = useMemo(() => {
        if (pendingWorkAssignmentCardId === null) {
            return null;
        }

        for (const list of lists) {
            for (const card of list.cards ?? []) {
                if (card.id === pendingWorkAssignmentCardId) {
                    return card;
                }
            }
        }

        return null;
    }, [lists, pendingWorkAssignmentCardId]);

    const pendingPullRequestActionCard = useMemo(() => {
        if (pendingPullRequestActionCardId === null) {
            return null;
        }

        for (const list of lists) {
            for (const card of list.cards ?? []) {
                if (card.id === pendingPullRequestActionCardId) {
                    return card;
                }
            }
        }

        return null;
    }, [lists, pendingPullRequestActionCardId]);

    const doneListId = useMemo(
        () => resolveDoneListId(board, lists),
        [board, lists],
    );

    const todoListId = useMemo(
        () => resolveTodoListId(board, lists),
        [board, lists],
    );

    const hasConnectedRepository = (board.github_repositories?.length ?? 0) > 0;

    const findCardById = useCallback(
        (cardId: number): Card | null => {
            for (const list of lists) {
                for (const card of list.cards ?? []) {
                    if (card.id === cardId) {
                        return card;
                    }
                }
            }

            return null;
        },
        [lists],
    );

    const pendingGithubIssueCloseCard = useMemo(() => {
        if (pendingGithubIssueCloseCardId === null) {
            return null;
        }

        return findCardById(pendingGithubIssueCloseCardId);
    }, [findCardById, pendingGithubIssueCloseCardId]);

    const pendingGithubIssueCard = useMemo(() => {
        if (pendingGithubIssueCardId === null) {
            return null;
        }

        return findCardById(pendingGithubIssueCardId);
    }, [findCardById, pendingGithubIssueCardId]);

    const updateLists = useCallback(
        (
            nextLists:
                | BoardList[]
                | ((currentLists: BoardList[]) => BoardList[]),
        ) => {
            setListsState((currentState) => {
                const currentLists =
                    currentState.signature === boardListSignature
                        ? currentState.items
                        : boardLists;
                const resolvedLists =
                    typeof nextLists === 'function'
                        ? nextLists(currentLists)
                        : nextLists;

                return {
                    signature: boardListSignature,
                    items: resolvedLists,
                };
            });
        },
        [boardListSignature, boardLists],
    );

    const reloadBoardAfterMove = useCallback(() => {
        window.setTimeout(() => {
            router.reload({
                only: ['board'],
                preserveScroll: true,
                preserveState: true,
            });
        }, 1400);
    }, []);

    const promptWorkAssignmentIfNeeded = useCallback(
        (cardId: number, targetList: BoardList) => {
            const context = workAssignmentContext(targetList, board, lists);

            if (context) {
                setPendingWorkAssignmentCardId(cardId);
                setPendingWorkAssignmentContext(context);
            }
        },
        [board, lists],
    );

    const promptGithubIssueIfNeeded = useCallback(
        (cardId: number, targetList: BoardList) => {
            if (
                listPromptsGithubIssue(
                    targetList,
                    todoListId,
                    findCardById(cardId),
                    hasConnectedRepository,
                )
            ) {
                setPendingGithubIssueCardId(cardId);
            }
        },
        [findCardById, hasConnectedRepository, todoListId],
    );

    const promptPullRequestActionIfNeeded = useCallback(
        (cardId: number, targetList: BoardList) => {
            if (
                listPromptsPullRequestAction(
                    targetList,
                    doneListId,
                    findCardById(cardId),
                )
            ) {
                setPendingPullRequestActionCardId(cardId);
            }
        },
        [doneListId, findCardById],
    );

    const promptGithubIssueCloseIfNeeded = useCallback(
        (cardId: number, targetList: BoardList) => {
            if (
                listPromptsGithubIssueClose(
                    targetList,
                    doneListId,
                    findCardById(cardId),
                )
            ) {
                setPendingGithubIssueCloseCardId(cardId);
            }
        },
        [doneListId, findCardById],
    );

    const deleteList = useCallback(
        (list: BoardList) => {
            if (!window.confirm(`Delete row "${list.name}"?`)) {
                return;
            }

            const previousLists = lists;
            updateLists((prev) =>
                prev
                    .filter((currentList) => currentList.id !== list.id)
                    .map((currentList, index) => ({
                        ...currentList,
                        position: index + 1,
                    })),
            );

            router.delete(listRoutes.destroy(list.id).url, {
                preserveScroll: true,
                onError: () => {
                    updateLists(previousLists);
                },
            });
        },
        [lists, updateLists],
    );

    const moveCardToList = useCallback(
        (card: Card, targetList: BoardList) => {
            if (card.list_id === targetList.id || movingCardId === card.id) {
                return;
            }

            const previousLists = lists;
            const nextPosition = (targetList.cards?.length ?? 0) + 1;

            setMovingCardId(card.id);
            updateLists((currentLists) =>
                moveCardBetweenLists(
                    currentLists,
                    card.id,
                    targetList.id,
                    nextPosition,
                ),
            );

            router.post(
                cardRoutes.move(card).url,
                { list_id: targetList.id, position: nextPosition },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        promptGithubIssueIfNeeded(card.id, targetList);
                        promptWorkAssignmentIfNeeded(card.id, targetList);
                        promptPullRequestActionIfNeeded(card.id, targetList);
                        promptGithubIssueCloseIfNeeded(card.id, targetList);
                        reloadBoardAfterMove();
                    },
                    onError: () => {
                        updateLists(previousLists);
                    },
                    onFinish: () => {
                        setMovingCardId((currentCardId) =>
                            currentCardId === card.id ? null : currentCardId,
                        );
                    },
                },
            );
        },
        [
            lists,
            movingCardId,
            promptGithubIssueIfNeeded,
            promptWorkAssignmentIfNeeded,
            promptPullRequestActionIfNeeded,
            promptGithubIssueCloseIfNeeded,
            reloadBoardAfterMove,
            updateLists,
        ],
    );

    const openCard = useCallback((card: Card) => {
        setSelectedCardId(card.id);
    }, []);

    return {
        lists,
        updateLists,
        selectedCard,
        selectedCardId,
        setSelectedCardId,
        movingCardId,
        moveCardToList,
        deleteList,
        pendingWorkAssignmentCard,
        pendingWorkAssignmentCardId,
        pendingWorkAssignmentContext,
        setPendingWorkAssignmentCardId,
        setPendingWorkAssignmentContext,
        promptWorkAssignmentIfNeeded,
        pendingGithubIssueCard,
        pendingGithubIssueCardId,
        setPendingGithubIssueCardId,
        promptGithubIssueIfNeeded,
        pendingPullRequestActionCard,
        pendingPullRequestActionCardId,
        setPendingPullRequestActionCardId,
        promptPullRequestActionIfNeeded,
        pendingGithubIssueCloseCard,
        pendingGithubIssueCloseCardId,
        setPendingGithubIssueCloseCardId,
        promptGithubIssueCloseIfNeeded,
        reloadBoardAfterMove,
        openCard,
    };
}
