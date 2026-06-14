import { Head } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BoardHeader } from '@/components/boards/board-header';
import { BoardKanban } from '@/components/boards/board-kanban';
import { BoardSettingsSheet } from '@/components/boards/board-settings-sheet';
import { CardModal } from '@/components/boards/card-modal';
import { GithubIssueCloseDialog } from '@/components/boards/github-issue-close-dialog';
import { GithubIssueDialog } from '@/components/boards/github-issue-dialog';
import { PullRequestActionDialog } from '@/components/boards/pull-request-action-dialog';
import { WorkAssigneeDialog } from '@/components/boards/work-assignee-dialog';
import type { AssignableMember } from '@/components/boards/work-assignee-dialog';
import { useBoardCollaborators } from '@/hooks/use-board-collaborators';
import { useBoardDnd } from '@/hooks/use-board-dnd';
import { useBoardLists } from '@/hooks/use-board-lists';
import { useIsClient } from '@/hooks/use-is-client';
import { useIsMobile } from '@/hooks/use-mobile';
import type { MentionableUser } from '@/hooks/use-mention-autocomplete';
import { moveCardBetweenLists } from '@/lib/board-list-utils';
import MobileBoard from '@/pages/mobile/boards/show';
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
    const isClient = useIsClient();
    const isMobile = useIsMobile();
    const [showSettings, setShowSettings] = useState(false);

    if (isMobile) {
        return <MobileBoard board={board} />;
    }
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
        pendingGithubIssueCloseCard,
        pendingGithubIssueCloseCardId,
        setPendingGithubIssueCloseCardId,
        promptGithubIssueCloseIfNeeded,
        reloadBoardAfterMove,
        openCard,
    } = useBoardLists(board);

    const normalizedAssignableMembers: AssignableMember[] = assignableMembers.map(
        (member) => ({
            id: member.id,
            name: member.name,
            avatar: member.avatar ?? null,
        }),
    );

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
        promptGithubIssueCloseIfNeeded,
        reloadBoardAfterMove,
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const cardId = params.get('card');

        if (!cardId) {
            return;
        }

        const id = parseInt(cardId, 10);
        const card = lists.flatMap((l) => l.cards ?? []).find((c) => c.id === id);

        if (card) {
            setSelectedCardId(id);
        }
    }, [lists, setSelectedCardId]);

    const handleCardMoved = useCallback(
        (e: CardMovedPayload) => {
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
        [updateLists],
    );

    useEffect(() => {
        if (!isClient) {
            return;
        }

        let active = true;
        let cleanup: (() => void) | undefined;

        void import('@laravel/echo-react').then(({ echo, echoIsConfigured }) => {
            if (!active || !echoIsConfigured()) {
                return;
            }

            try {
                const echoInstance = echo();
                const channel = echoInstance.private(`board.${board.id}`);
                channel.listen('CardMoved', handleCardMoved);
                cleanup = () => {
                    echoInstance.leave(`board.${board.id}`);
                };
            } catch {
                // Real-time updates are optional; the board should still work without Echo.
            }
        });

        return () => {
            active = false;
            cleanup?.();
        };
    }, [isClient, board.id, handleCardMoved]);

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
                assignableMembers={normalizedAssignableMembers}
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

            <GithubIssueCloseDialog
                card={pendingGithubIssueCloseCard}
                open={pendingGithubIssueCloseCardId !== null}
                onClose={() => setPendingGithubIssueCloseCardId(null)}
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
