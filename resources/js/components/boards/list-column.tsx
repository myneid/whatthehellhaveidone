import { router } from '@inertiajs/react';
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Settings, Trash2 } from 'lucide-react';
import { useMemo, useState, type RefObject } from 'react';
import { AddCardForm } from '@/components/boards/add-card-form';
import { SortableBoardCard } from '@/components/boards/sortable-board-card';
import { Button } from '@/components/ui/button';
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
import * as listRoutes from '@/routes/lists';
import type { BoardList, Card } from '@/types/app';

type ListColumnProps = {
    list: BoardList;
    onOpenCard: (card: Card) => void;
    onDeleteList: (list: BoardList) => void;
    ignoreCardClickRef: RefObject<boolean>;
};

export function ListColumn({
    list,
    onOpenCard,
    onDeleteList,
    ignoreCardClickRef,
}: ListColumnProps) {
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
                                        <SelectItem value="close_pull_request">
                                            Close pull request
                                        </SelectItem>
                                        <SelectItem value="merge_pull_request">
                                            Merge pull request
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
                        <SortableBoardCard
                            key={card.id}
                            card={card}
                            onOpen={onOpenCard}
                            ignoreClickRef={ignoreCardClickRef}
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
