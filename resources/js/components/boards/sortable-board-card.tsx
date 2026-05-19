import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { RefObject } from 'react';
import { BoardCard } from '@/components/boards/board-card';
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
        <BoardCard
            ref={setNodeRef}
            style={style}
            card={card}
            {...attributes}
            {...listeners}
            className={cn(isDragging && 'board-card--dragging')}
            onClick={() => {
                if (ignoreClickRef.current) {
                    return;
                }

                onOpen(card);
            }}
        />
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
