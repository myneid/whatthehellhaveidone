import type { BoardList, Card } from '@/types/app';

export function normalizeLists(nextLists: BoardList[]): BoardList[] {
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

export function moveCardBetweenLists(
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

export function listPromptsWorkAssignment(
    list: BoardList,
    copilotDoneListId: number | null,
): boolean {
    return copilotDoneListId !== null && list.id === copilotDoneListId;
}

export function buildBoardListSignature(boardLists: BoardList[]): string {
    return boardLists
        .map(
            (list) =>
                `${list.id}:${list.name}:${list.position}:${list.github_action ?? 'none'}:${(list.cards ?? [])
                    .map((card) => {
                        const attachmentSignature = (card.attachments ?? [])
                            .map(
                                (attachment) =>
                                    `${attachment.id}:${attachment.updated_at ?? attachment.created_at}`,
                            )
                            .join('.');
                        const commentSignature = (card.comments ?? [])
                            .map(
                                (comment) =>
                                    `${comment.id}:${comment.updated_at ?? comment.created_at}`,
                            )
                            .join('.');

                        const githubLinkSignature = card.github_link
                            ? `${card.github_link.id}:${card.github_link.issue_number}:${card.github_link.state}:${card.github_link.pull_request_number ?? 'none'}:${card.github_link.pull_request_state ?? 'none'}:${card.github_link.synced_at ?? ''}`
                            : 'none';

                        return `${card.id}:${card.updated_at}:${attachmentSignature}:${commentSignature}:${githubLinkSignature}`;
                    })
                    .join(',')}`,
        )
        .join('|');
}

export function findCardInLists(
    lists: BoardList[],
    id: string,
): { card: Card; listId: number } | null {
    for (const list of lists) {
        for (const card of list.cards ?? []) {
            if (`card-${card.id}` === id) {
                return { card, listId: list.id };
            }
        }
    }

    return null;
}
