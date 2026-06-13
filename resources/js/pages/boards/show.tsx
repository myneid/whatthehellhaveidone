import { Head } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BoardHeader } from '@/components/boards/board-header';
import { BoardKanban } from '@/components/boards/board-kanban';
import { BoardSettingsSheet } from '@/components/boards/board-settings-sheet';
import { CardModal } from '@/components/boards/card-modal';
import { GithubIssueDialog } from '@/components/boards/github-issue-dialog';
import { PullRequestActionDialog } from '@/components/boards/pull-request-action-dialog';
import { WorkAssigneeDialog } from '@/components/boards/work-assignee-dialog';
import type { AssignableMember } from '@/components/boards/work-assignee-dialog';
import { useBoardCollaborators } from '@/hooks/use-board-collaborators';
import { useBoardDnd } from '@/hooks/use-board-dnd';
import { useBoardLists } from '@/hooks/use-board-lists';
import type { MentionableUser } from '@/hooks/use-mention-autocomplete';
import { moveCardBetweenLists } from '@/lib/board-list-utils';
import { dashboard } from '@/routes';
import * as boardRoutes from '@/routes/boards';
import * as projectRoutes from '@/routes/projects';
import type { BreadcrumbItem } from '@/types';
import type { Board, GithubAccount } from '@/types/app';

type CardMovedPayload = {
    card_id: number;
    list_id: number;
    position: number;
    from_list_id: number;
};

type Props = {
    board: Board;
    githubAccounts: GithubAccount[];
    assignableMembers: AssignableMember[];
    mentionableMembers: MentionableUser[];
};

export default function BoardShow({
    board,
    githubAccounts,
    assignableMembers: assignableMembersProp,
    mentionableMembers: mentionableMembersProp,
}: Props) {
    const [showSettings, setShowSettings] = useState(false);
    const { mentionableMembers, assignableMembers } = useBoardCollaborators(
        board,
        mentionableMembersProp.length > 0
            ? mentionableMembersProp
            : (board.mentionable_members ?? []),
        assignableMembersProp.length > 0
            ? assignableMembersProp
            : (board.assignable_members ?? []),
        true,
    );

    const {
        lists,
        updateLists,
        selectedCard,
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
        reloadBoardAfterMove,
        openCard,
    } = useBoardLists(board);

    const {
        sensors,
        activeCard,
        ignoreCardClickRef,
        onDragStart,
        onDragOver,
        onDragEnd,
    } = useBoardDnd({
        lists,
        updateLists,
        promptWorkAssignmentIfNeeded,
        promptGithubIssueIfNeeded,
        promptPullRequestActionIfNeeded,
        reloadBoardAfterMove,
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cardId = params.get('card');
        if (!cardId) return;

        const id = parseInt(cardId, 10);
        const card = lists.flatMap((l) => l.cards ?? []).find((c) => c.id === id);
        if (card) {
            setSelectedCardId(id);
        }
    }, []);

    useEcho<CardMovedPayload>(
        `board.${board.id}`,
        'CardMoved',
        (e) => {
            updateLists((currentLists) => {
                const cardAlreadyInTargetList = currentLists
                    .find((l) => l.id === e.list_id)
                    ?.cards?.some((c) => c.id === e.card_id);

                if (cardAlreadyInTargetList) {
                    return currentLists;
                }

                const targetList = currentLists.find((l) => l.id === e.list_id);
                const fromList = currentLists.find((l) => l.id === e.from_list_id);

                if (targetList && fromList && targetList.name !== fromList.name) {
                    toast.info(`Card moved to ${targetList.name}`);
                }

                return moveCardBetweenLists(currentLists, e.card_id, e.list_id, e.position);
            });
        },
        [board.id],
    );

    return (
        <>
            <Head title={board.name} />

            <div className="flex h-full flex-col">
                <BoardHeader
                    board={board}
                    onOpenSettings={() => setShowSettings(true)}
                />

                <BoardKanban
                    board={board}
                    lists={lists}
                    mentionableMembers={mentionableMembers}
                    sensors={sensors}
                    activeCard={activeCard}
                    ignoreCardClickRef={ignoreCardClickRef}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                    onOpenCard={openCard}
                    onDeleteList={deleteList}
                />
            </div>

            {selectedCard && (
                <CardModal
                    card={selectedCard}
                    board={board}
                    lists={lists}
                    mentionableMembers={mentionableMembers}
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

            <GithubIssueDialog
                card={pendingGithubIssueCard}
                board={board}
                open={pendingGithubIssueCardId !== null}
                onClose={() => setPendingGithubIssueCardId(null)}
            />

            <WorkAssigneeDialog
                card={pendingWorkAssignmentCard}
                assignableMembers={assignableMembers}
                context={pendingWorkAssignmentContext}
                open={pendingWorkAssignmentCardId !== null}
                onClose={() => {
                    setPendingWorkAssignmentCardId(null);
                    setPendingWorkAssignmentContext(null);
                }}
            />

            <PullRequestActionDialog
                card={pendingPullRequestActionCard}
                open={pendingPullRequestActionCardId !== null}
                onClose={() => setPendingPullRequestActionCardId(null)}
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
