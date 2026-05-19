import {
    DndContext,
    DragOverlay,
    closestCenter,
} from '@dnd-kit/core';
import type {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    SensorDescriptor,
    SensorOptions,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useState, type RefObject } from 'react';
import { AddListForm } from '@/components/boards/add-list-form';
import { BoardCardOverlay } from '@/components/boards/sortable-board-card';
import { ListColumn } from '@/components/boards/list-column';
import { ListColumnStatic } from '@/components/boards/list-column-static';
import { Button } from '@/components/ui/button';
import { useIsClient } from '@/hooks/use-is-client';
import type { Board, BoardList, Card } from '@/types/app';

type BoardKanbanProps = {
    board: Board;
    lists: BoardList[];
    sensors: SensorDescriptor<SensorOptions>[];
    activeCard: Card | null;
    ignoreCardClickRef: RefObject<boolean>;
    onDragStart: (event: DragStartEvent) => void;
    onDragOver: (event: DragOverEvent) => void;
    onDragEnd: (event: DragEndEvent) => void;
    onOpenCard: (card: Card) => void;
    onDeleteList: (list: BoardList) => void;
};

function BoardKanbanAddListColumn({
    board,
}: {
    board: Board;
}) {
    const [addingList, setAddingList] = useState(false);

    return (
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
    );
}

function BoardKanbanStatic({
    board,
    lists,
    onOpenCard,
    onDeleteList,
}: Pick<
    BoardKanbanProps,
    'board' | 'lists' | 'onOpenCard' | 'onDeleteList'
>) {
    return (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex h-[calc(100vh-12rem)] items-start gap-4 p-6">
                {lists.map((list) => (
                    <ListColumnStatic
                        key={list.id}
                        list={list}
                        onOpenCard={onOpenCard}
                        onDeleteList={onDeleteList}
                    />
                ))}
                <BoardKanbanAddListColumn board={board} />
            </div>
        </div>
    );
}

function BoardKanbanInteractive({
    board,
    lists,
    sensors,
    activeCard,
    ignoreCardClickRef,
    onDragStart,
    onDragOver,
    onDragEnd,
    onOpenCard,
    onDeleteList,
}: BoardKanbanProps) {
    return (
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
                                onOpenCard={onOpenCard}
                                onDeleteList={onDeleteList}
                                ignoreCardClickRef={ignoreCardClickRef}
                            />
                        ))}
                        <BoardKanbanAddListColumn board={board} />
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeCard ? (
                        <BoardCardOverlay card={activeCard} />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

export function BoardKanban(props: BoardKanbanProps) {
    const isClient = useIsClient();

    if (!isClient) {
        return (
            <BoardKanbanStatic
                board={props.board}
                lists={props.lists}
                onOpenCard={props.onOpenCard}
                onDeleteList={props.onDeleteList}
            />
        );
    }

    return <BoardKanbanInteractive {...props} />;
}
