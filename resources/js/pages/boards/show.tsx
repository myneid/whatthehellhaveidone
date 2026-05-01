import {
    DndContext,
    DragOverlay,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    horizontalListSortingStrategy,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { GripVertical, Plus, Settings, Trash2, X } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { BoardSettingsSheet } from '@/components/boards/board-settings-sheet';
import { CardModal } from '@/components/boards/card-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { dashboard } from '@/routes';
import * as boardRoutes from '@/routes/boards';
import * as boardListRoutes from '@/routes/boards/lists';
import * as cardRoutes from '@/routes/cards';
import * as listRoutes from '@/routes/lists';
import * as projectRoutes from '@/routes/projects';
import type { BreadcrumbItem } from '@/types';
import type { Board, BoardList, Card, GithubAccount } from '@/types/app';

function normalizeLists(nextLists: BoardList[]): BoardList[] {
    return nextLists.map((list) => {
        const listSnapshot: BoardList = { ...list, cards: undefined };

        return {
            ...list,
            cards: (list.cards ?? []).map((card, index) => ({
                ...card,
                list_id: list.id,
                position: index + 1,
                list: listSnapshot,
            })),
        };
    });
}

function moveCardBetweenLists(
    nextLists: BoardList[],
    cardId: number,
    targetListId: number,
    targetPosition: number,
): BoardList[] {
    let movingCard: Card | null = null;

    const listsWithoutCard = nextLists.map((list) => {
        const cardIndex = (list.cards ?? []).findIndex(
            (card) => card.id === cardId,
        );

        if (cardIndex === -1) {
            return list;
        }

        movingCard = (list.cards ?? [])[cardIndex] ?? null;

        return {
            ...list,
            cards: (list.cards ?? []).filter((card) => card.id !== cardId),
        };
    });

    const cardToMove = movingCard;

    if (!cardToMove) {
        return nextLists;
    }

    const movedLists = listsWithoutCard.map((list) => {
        if (list.id !== targetListId) {
            return list;
        }

        const cards = [...(list.cards ?? [])];
        const insertIndex = Math.max(
            0,
            Math.min(targetPosition - 1, cards.length),
        );
        cards.splice(insertIndex, 0, cardToMove);

        return {
            ...list,
            cards,
        };
    });

    return normalizeLists(movedLists);
}

type Props = {
    board: Board;
    githubAccounts: GithubAccount[];
};

const PRIORITY_COLORS: Record<string, string> = {
    none: 'border-l-gray-200',
    low: 'border-l-blue-400',
    medium: 'border-l-yellow-400',
    high: 'border-l-orange-400',
    critical: 'border-l-red-500',
};

function AddCardForm({
    listId,
    onDone,
}: {
    listId: number;
    onDone: () => void;
}) {
    const form = useForm({ title: '', list_id: listId });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.data.title.trim()) {
            return;
        }

        form.post(cardRoutes.store().url, {
            onSuccess: () => {
                form.reset();
                onDone();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-2 px-1">
            <Input
                value={form.data.title}
                onChange={(e) => form.setData('title', e.target.value)}
                placeholder="Card title..."
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        onDone();
                    }
                }}
            />
            <div className="flex gap-1">
                <Button type="submit" size="sm" disabled={form.processing}>
                    Add
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={onDone}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}

function AddListForm({ board, onDone }: { board: Board; onDone: () => void }) {
    const form = useForm({ name: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.data.name.trim()) {
            return;
        }

        form.post(boardListRoutes.store(board).url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onDone();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-2">
            <Input
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
                placeholder="Row name..."
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        onDone();
                    }
                }}
            />
            <div className="flex gap-1">
                <Button type="submit" size="sm" disabled={form.processing}>
                    Add row
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={onDone}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}

type SortableCardProps = {
    card: Card;
    onOpen: (card: Card) => void;
};

function SortableCard({ card, onOpen }: SortableCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `card-${card.id}`,
        data: { type: 'card', card },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`group cursor-pointer rounded-md border border-l-4 bg-card p-2 shadow-sm transition-shadow hover:shadow-md ${PRIORITY_COLORS[card.priority ?? 'none']}`}
            onClick={() => onOpen(card)}
        >
            <div className="flex items-start justify-between gap-1">
                <span className="text-sm leading-snug">{card.title}</span>
                <button
                    {...attributes}
                    {...listeners}
                    className="shrink-0 cursor-grab text-muted-foreground opacity-0 group-hover:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <GripVertical className="h-4 w-4" />
                </button>
            </div>

            {card.labels && card.labels.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                    {card.labels.map((label) => (
                        <span
                            key={label.id}
                            className="h-2 rounded-full px-2"
                            style={{ backgroundColor: label.color }}
                            title={label.name}
                        />
                    ))}
                </div>
            )}

            {card.assignees?.length ||
            card.due_at ||
            card.checklists?.length ||
            card.github_link ? (
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    {card.due_at && (
                        <span>
                            {new Date(card.due_at).toLocaleDateString(
                                undefined,
                                { month: 'short', day: 'numeric' },
                            )}
                        </span>
                    )}
                    {card.checklists?.length ? (
                        <span>
                            {card.checklists.reduce(
                                (n, cl) =>
                                    n +
                                    (cl.items?.filter((i) => i.is_completed)
                                        .length ?? 0),
                                0,
                            )}
                            /
                            {card.checklists.reduce(
                                (n, cl) => n + (cl.items?.length ?? 0),
                                0,
                            )}
                        </span>
                    ) : null}
                    {card.github_link && (
                        <a
                            href={card.github_link.issue_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-0.5 hover:text-foreground"
                            title={`GitHub issue #${card.github_link.issue_number} (${card.github_link.state})`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <svg
                                className="h-3 w-3"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            <span>#{card.github_link.issue_number}</span>
                        </a>
                    )}
                    {card.assignees?.length ? (
                        <div className="ml-auto flex -space-x-1">
                            {card.assignees.slice(0, 3).map((u) => (
                                <div
                                    key={u.id}
                                    className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground ring-1 ring-card"
                                >
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

type ListColumnProps = {
    list: BoardList;
    onOpenCard: (card: Card) => void;
    onDeleteList: (list: BoardList) => void;
};

function ListColumn({ list, onOpenCard, onDeleteList }: ListColumnProps) {
    const [addingCard, setAddingCard] = useState(false);
    const cardIds = useMemo(
        () => (list.cards ?? []).map((c) => `card-${c.id}`),
        [list.cards],
    );
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: `list-${list.id}`,
        data: { type: 'list', list },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    function saveGithubAction(value: string) {
        router.patch(
            listRoutes.update(list).url,
            { github_action: value === 'none' ? null : value },
            { preserveScroll: true },
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex h-full max-h-full w-72 shrink-0 flex-col rounded-lg border bg-muted/50"
        >
            <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                    <button
                        {...attributes}
                        {...listeners}
                        className="shrink-0 cursor-grab text-muted-foreground"
                        type="button"
                        aria-label={`Reorder ${list.name}`}
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                    <span className="truncate text-sm font-medium">
                        {list.name}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">
                        {list.cards?.length ?? 0}
                    </span>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground"
                                aria-label="Column settings"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-64 space-y-3 p-3"
                            align="end"
                        >
                            <div className="space-y-1.5">
                                <p className="text-xs font-medium">
                                    When a card is moved here
                                </p>
                                <Select
                                    value={list.github_action ?? 'none'}
                                    onValueChange={saveGithubAction}
                                >
                                    <SelectTrigger className="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Do nothing
                                        </SelectItem>
                                        <SelectItem value="open_issue">
                                            Create GitHub issue
                                        </SelectItem>
                                        <SelectItem value="close_issue">
                                            Close GitHub issue
                                        </SelectItem>
                                        <SelectItem value="reopen_issue">
                                            Reopen GitHub issue
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="border-t pt-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-full justify-start text-xs text-destructive hover:text-destructive"
                                    onClick={() => onDeleteList(list)}
                                >
                                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                    Delete column
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <SortableContext
                items={cardIds}
                strategy={verticalListSortingStrategy}
            >
                <div
                    className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-2 pb-2"
                    style={{ minHeight: 40 }}
                >
                    {(list.cards ?? []).map((card) => (
                        <SortableCard
                            key={card.id}
                            card={card}
                            onOpen={onOpenCard}
                        />
                    ))}
                </div>
            </SortableContext>

            <div className="px-2 pb-2">
                {addingCard ? (
                    <AddCardForm
                        listId={list.id}
                        onDone={() => setAddingCard(false)}
                    />
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-muted-foreground"
                        onClick={() => setAddingCard(true)}
                    >
                        <Plus className="mr-1 h-4 w-4" />
                        Add card
                    </Button>
                )}
            </div>
        </div>
    );
}

function CardOverlay({ card }: { card: Card }) {
    return (
        <div className="w-72 cursor-grabbing rounded-md border bg-card p-2 shadow-xl">
            <span className="text-sm">{card.title}</span>
        </div>
    );
}

export default function BoardShow({ board, githubAccounts }: Props) {
    const boardLists = useMemo(
        () => normalizeLists(board.lists ?? []),
        [board.lists],
    );
    const boardListSignature = useMemo(
        () =>
            boardLists
                .map(
                    (list) =>
                        `${list.id}:${(list.cards ?? []).map((card) => `${card.id}:${card.updated_at}`).join(',')}`,
                )
                .join('|'),
        [boardLists],
    );
    const [listsState, setListsState] = useState<{
        signature: string;
        items: BoardList[];
    }>({
        signature: boardListSignature,
        items: boardLists,
    });
    const [activeCard, setActiveCard] = useState<Card | null>(null);
    const [addingList, setAddingList] = useState(false);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [movingCardId, setMovingCardId] = useState<number | null>(null);
    const [showSettings, setShowSettings] = useState(false);
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

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    );

    function findCard(id: string): { card: Card; listId: number } | null {
        for (const list of lists) {
            for (const card of list.cards ?? []) {
                if (`card-${card.id}` === id) {
                    return { card, listId: list.id };
                }
            }
        }

        return null;
    }

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === 'list') {
            return;
        }

        const found = findCard(String(event.active.id));

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

        const activeFound = findCard(activeId);

        if (!activeFound) {
            return;
        }

        // Dropped over a list column (not a card)
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

        const overFound = findCard(overId);

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
        const activeFound = findCard(activeId);

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
            { preserveScroll: true },
        );
    }

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
        [lists, movingCardId, updateLists],
    );

    function openCard(card: Card) {
        setSelectedCardId(card.id);
    }

    return (
        <>
            <Head title={board.name} />

            <div className="flex h-full flex-col">
                <div
                    className="flex items-center gap-3 border-b px-6 py-3"
                    style={
                        board.background_color
                            ? { borderBottomColor: board.background_color }
                            : {}
                    }
                >
                    <h1 className="text-xl font-bold">{board.name}</h1>
                    {board.visibility && board.visibility !== 'team' && (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                            {board.visibility}
                        </span>
                    )}
                    <div className="ml-auto flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/boards/${board.slug}/report`}>
                                Report
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSettings(true)}
                        >
                            <Settings className="mr-1.5 h-4 w-4" />
                            Settings
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-x-auto overflow-y-hidden">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={onDragStart}
                        onDragOver={onDragOver}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext
                            items={lists.map((list) => `list-${list.id}`)}
                            strategy={horizontalListSortingStrategy}
                        >
                            <div className="flex h-[calc(100vh-12rem)] items-start gap-4 p-6">
                                {lists.map((list) => (
                                    <ListColumn
                                        key={list.id}
                                        list={list}
                                        onOpenCard={openCard}
                                        onDeleteList={deleteList}
                                    />
                                ))}

                                <div className="w-72 shrink-0 rounded-lg border bg-muted/30 p-2">
                                    {addingList ? (
                                        <AddListForm
                                            board={board}
                                            onDone={() => setAddingList(false)}
                                        />
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start"
                                            onClick={() => setAddingList(true)}
                                        >
                                            <Plus className="mr-1 h-4 w-4" />
                                            Add row
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </SortableContext>

                        <DragOverlay>
                            {activeCard ? (
                                <CardOverlay card={activeCard} />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
            </div>

            {selectedCard && (
                <CardModal
                    card={selectedCard}
                    board={board}
                    lists={lists}
                    isMoving={movingCardId === selectedCard.id}
                    onMoveToList={(list) => moveCardToList(selectedCard, list)}
                    open={!!selectedCard}
                    onClose={() => setSelectedCardId(null)}
                />
            )}

            <BoardSettingsSheet
                board={board}
                githubAccounts={githubAccounts}
                open={showSettings}
                onClose={() => setShowSettings(false)}
            />
        </>
    );
}

BoardShow.layout = (props: Props): { breadcrumbs: BreadcrumbItem[] } => {
    const crumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard() },
    ];

    if (props.board.project) {
        crumbs.push({
            title: props.board.project.name,
            href: projectRoutes.show(props.board.project).url,
        });
    }

    crumbs.push({
        title: props.board.name,
        href: boardRoutes.show(props.board).url,
    });

    return { breadcrumbs: crumbs };
};
