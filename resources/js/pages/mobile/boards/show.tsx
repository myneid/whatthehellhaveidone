import { Link, router } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CardModal } from '@/components/boards/card-modal';
import { CreateCardDialog } from '@/components/boards/create-card-dialog';
import { MobileButton } from '@/components/mobile/edge/MobileButton';
import { MobileCard } from '@/components/mobile/edge/MobileCard';
import { MobileShell } from '@/components/mobile/edge/MobileShell';
import type { MentionableUser } from '@/hooks/use-mention-autocomplete';
import type { Board, BoardList } from '@/types/app';
import { dashboard } from '@/routes';
import * as cardRoutes from '@/routes/cards';

interface MobileBoardProps {
    board: Board;
    mentionableMembers?: MentionableUser[];
}

export default function MobileBoard({
    board,
    mentionableMembers = [],
}: MobileBoardProps) {
    const lists = useMemo(() => board.lists ?? [], [board.lists]);
    const effectiveMentionableMembers =
        mentionableMembers.length > 0
            ? mentionableMembers
            : (board.mentionable_members ?? []);
    const [creatingCardInListId, setCreatingCardInListId] = useState<number | null>(null);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [movingCardId, setMovingCardId] = useState<number | null>(null);

    const createCardList = useMemo(
        () => lists.find((list) => list.id === creatingCardInListId) ?? null,
        [lists, creatingCardInListId],
    );
    const selectedCard = useMemo(
        () =>
            selectedCardId === null
                ? null
                : (lists
                      .flatMap((list) => list.cards ?? [])
                      .find((card) => card.id === selectedCardId) ?? null),
        [lists, selectedCardId],
    );
    const moveSelectedCardToList = (targetList: BoardList) => {
        if (!selectedCard) {
            return;
        }

        if (selectedCard.list_id === targetList.id) {
            return;
        }

        if (movingCardId === selectedCard.id) {
            return;
        }

        const nextPosition = (targetList.cards?.length ?? 0) + 1;
        setMovingCardId(selectedCard.id);

        router.post(
            cardRoutes.move(selectedCard).url,
            { list_id: targetList.id, position: nextPosition },
            {
                preserveScroll: true,
                onFinish: () => setMovingCardId(null),
            },
        );
    };

    return (
        <>
            <MobileShell
                header={
                    <div className="flex items-center gap-3">
                        <Link href={dashboard().url} className="text-muted-foreground">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-xl font-bold">{board.name}</h1>
                    </div>
                }
            >
                <div className="space-y-6 pb-24">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Lists</h2>
                    </div>

                    <div className="space-y-4">
                        {lists.map((list) => {
                            const cards = list.cards ?? [];

                            return (
                                <div key={list.id} className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                            {list.name}
                                        </h3>
                                        <span className="bg-muted rounded-full px-2 py-0.5 text-xs text-muted-foreground">
                                            {cards.length}
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        {cards.length === 0 ? (
                                            <div className="rounded-xl border-2 border-dashed py-4 text-center text-xs text-muted-foreground">
                                                No cards
                                            </div>
                                        ) : (
                                            cards.map((card) => (
                                                <MobileCard
                                                    key={card.id}
                                                    className="cursor-pointer transition-transform active:scale-[0.98]"
                                                    onClick={() => setSelectedCardId(card.id)}
                                                >
                                                    <div className="space-y-2">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <h4 className="text-sm font-medium leading-tight">
                                                                {card.title}
                                                            </h4>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {card.labels?.map((label) => (
                                                                <span
                                                                    key={label.id}
                                                                    className="h-2 w-4 rounded-full"
                                                                    style={{ backgroundColor: label.color }}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </MobileCard>
                                            ))
                                        )}
                                    </div>

                                    <MobileButton
                                        size="sm"
                                        variant="outline"
                                        className="w-full gap-2"
                                        onClick={() => setCreatingCardInListId(list.id)}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add card
                                    </MobileButton>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </MobileShell>

            <CreateCardDialog
                board={board}
                list={createCardList}
                mentionableMembers={effectiveMentionableMembers}
                open={creatingCardInListId !== null}
                onClose={() => setCreatingCardInListId(null)}
            />

            {selectedCard && (
                <CardModal
                    card={selectedCard}
                    board={board}
                    lists={lists}
                    mentionableMembers={effectiveMentionableMembers}
                    isMoving={movingCardId === selectedCard.id}
                    onMoveToList={moveSelectedCardToList}
                    open
                    onClose={() => setSelectedCardId(null)}
                />
            )}
        </>
    );
}
