import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Paperclip } from 'lucide-react';
import type { RefObject } from 'react';
import { BOARD_CARD_PRIORITY_COLORS } from '@/components/boards/board-constants';
import { cn } from '@/lib/utils';
import type { Card } from '@/types/app';

type SortableBoardCardProps = {
    card: Card;
    onOpen: (card: Card) => void;
    ignoreClickRef: RefObject<boolean>;
};

export function SortableBoardCard({
    card,
    onOpen,
    ignoreClickRef,
}: SortableBoardCardProps) {
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
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                'board-card group rounded-md border border-l-4 bg-card p-2 shadow-sm hover:shadow-md',
                BOARD_CARD_PRIORITY_COLORS[card.priority ?? 'none'],
                isDragging && 'board-card--dragging',
            )}
            onClick={() => {
                if (ignoreClickRef.current) {
                    return;
                }

                onOpen(card);
            }}
        >
            <div className="flex items-start justify-between gap-1">
                <span className="text-sm leading-snug">{card.title}</span>
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
            card.attachments?.length ||
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
                    {card.attachments?.length ? (
                        <span
                            className="inline-flex items-center gap-1"
                            title={`${card.attachments.length} attachment${card.attachments.length === 1 ? '' : 's'}`}
                        >
                            <Paperclip className="h-3 w-3" />
                            <span>{card.attachments.length}</span>
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

export function BoardCardOverlay({ card }: { card: Card }) {
    return (
        <div
            className={cn(
                'board-card-overlay w-72 rounded-md border border-l-4 bg-card p-2',
                BOARD_CARD_PRIORITY_COLORS[card.priority ?? 'none'],
            )}
        >
            <span className="text-sm leading-snug">{card.title}</span>
        </div>
    );
}
