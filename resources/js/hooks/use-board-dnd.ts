import {
    PointerSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { router } from '@inertiajs/react';
import { useRef, useState } from 'react';
import {
    findCardInLists,
    normalizeLists,
} from '@/lib/board-list-utils';
import * as cardRoutes from '@/routes/cards';
import * as listRoutes from '@/routes/lists';
import type { BoardList, Card } from '@/types/app';

type UseBoardDndOptions = {
    lists: BoardList[];
    updateLists: (
        nextLists:
            | BoardList[]
            | ((currentLists: BoardList[]) => BoardList[]),
    ) => void;
    promptWorkAssignmentIfNeeded: (cardId: number, targetList: BoardList) => void;
    reloadBoardAfterMove: () => void;
};

export function useBoardDnd({
    lists,
    updateLists,
    promptWorkAssignmentIfNeeded,
    reloadBoardAfterMove,
}: UseBoardDndOptions) {
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const ignoreCardClickRef = useRef(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                delay: 175,
                tolerance: 6,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 200,
                tolerance: 8,
            },
        }),
    );

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'list') {
            return;
        }

        ignoreCardClickRef.current = true;

        const found = findCardInLists(lists, String(event.active.id));

        if (found) {
            setActiveCard(found.card);
        }
    }

    function onDragOver(event: DragOverEvent) {
        if (event.active.data.current?.type === 'list') {
            return;
        }

        const { active, over } = event;

        if (!over) {
            return;
        }

        const activeId = String(active.id);
        const overId = String(over.id);

        if (activeId === overId) {
            return;
        }

        const activeFound = findCardInLists(lists, activeId);

        if (!activeFound) {
            return;
        }

        const overList = lists.find((l) => `list-${l.id}` === overId);

        if (overList) {
            if (activeFound.listId === overList.id) {
                return;
            }

            updateLists((prev) =>
                normalizeLists(
                    prev.map((list) => {
                        if (list.id === activeFound.listId) {
                            return {
                                ...list,
                                cards: (list.cards ?? []).filter(
                                    (c) => c.id !== activeFound.card.id,
                                ),
                            };
                        }

                        if (list.id === overList.id) {
                            return {
                                ...list,
                                cards: [
                                    ...(list.cards ?? []),
                                    activeFound.card,
                                ],
                            };
                        }

                        return list;
                    }),
                ),
            );

            return;
        }

        const overFound = findCardInLists(lists, overId);

        if (!overFound) {
            return;
        }

        if (activeFound.listId === overFound.listId) {
            updateLists((prev) =>
                normalizeLists(
                    prev.map((list) => {
                        if (list.id !== activeFound.listId) {
                            return list;
                        }

                        const cards = list.cards ?? [];
                        const oldIdx = cards.findIndex(
                            (c) => c.id === activeFound.card.id,
                        );
                        const newIdx = cards.findIndex(
                            (c) => c.id === overFound.card.id,
                        );

                        return {
                            ...list,
                            cards: arrayMove(cards, oldIdx, newIdx),
                        };
                    }),
                ),
            );
        } else {
            updateLists((prev) =>
                normalizeLists(
                    prev.map((list) => {
                        if (list.id === activeFound.listId) {
                            return {
                                ...list,
                                cards: (list.cards ?? []).filter(
                                    (c) => c.id !== activeFound.card.id,
                                ),
                            };
                        }

                        if (list.id === overFound.listId) {
                            const cards = [...(list.cards ?? [])];
                            const insertIdx = cards.findIndex(
                                (c) => c.id === overFound.card.id,
                            );
                            cards.splice(insertIdx, 0, activeFound.card);

                            return { ...list, cards };
                        }

                        return list;
                    }),
                ),
            );
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveCard(null);

        window.setTimeout(() => {
            ignoreCardClickRef.current = false;
        }, 50);

        if (event.active.data.current?.type === 'list') {
            const overId = event.over?.id;

            if (!overId) {
                return;
            }

            const activeListId = Number(
                String(event.active.id).replace('list-', ''),
            );
            const overListId = Number(String(overId).replace('list-', ''));

            if (activeListId === overListId) {
                return;
            }

            const oldIndex = lists.findIndex(
                (list) => list.id === activeListId,
            );
            const newIndex = lists.findIndex((list) => list.id === overListId);

            if (oldIndex === -1 || newIndex === -1) {
                return;
            }

            const reordered = arrayMove(lists, oldIndex, newIndex).map(
                (list, index) => ({
                    ...list,
                    position: index + 1,
                }),
            );

            updateLists(reordered);

            router.patch(
                listRoutes.update(activeListId).url,
                { position: newIndex + 1 },
                { preserveScroll: true },
            );

            return;
        }

        const { active, over } = event;

        if (!over) {
            return;
        }

        const activeId = String(active.id);
        const activeFound = findCardInLists(lists, activeId);

        if (!activeFound) {
            return;
        }

        const newList = lists.find((l) =>
            l.cards?.some((c) => c.id === activeFound.card.id),
        );

        if (!newList) {
            return;
        }

        const newPosition =
            (newList.cards?.findIndex((c) => c.id === activeFound.card.id) ??
                0) + 1;

        router.post(
            cardRoutes.move(activeFound.card).url,
            { list_id: newList.id, position: newPosition },
            {
                preserveScroll: true,
                onSuccess: () => {
                    promptWorkAssignmentIfNeeded(
                        activeFound.card.id,
                        newList,
                    );
                    reloadBoardAfterMove();
                },
            },
        );
    }

    return {
        sensors,
        activeCard,
        ignoreCardClickRef,
        onDragStart,
        onDragOver,
        onDragEnd,
    };
}
