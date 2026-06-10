import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { BoardHeader } from '@/components/boards/board-header';
import { BoardKanban } from '@/components/boards/board-kanban';
import { BoardSettingsSheet } from '@/components/boards/board-settings-sheet';
import { CardModal } from '@/components/boards/card-modal';
import { GithubIssueDialog } from '@/components/boards/github-issue-dialog';
import { PullRequestActionDialog } from '@/components/boards/pull-request-action-dialog';
import { WorkAssigneeDialog } from '@/components/boards/work-assignee-dialog';
import type { AssignableMember } from '@/components/boards/work-assignee-dialog';
import { useBoardDnd } from '@/hooks/use-board-dnd';
import { useBoardLists } from '@/hooks/use-board-lists';
import type { MentionableUser } from '@/hooks/use-mention-autocomplete';
import {
    resolveAssignableMembers,
    resolveMentionableMembers,
} from '@/lib/board-member-lists';
import { dashboard } from '@/routes';
import * as boardRoutes from '@/routes/boards';
import * as projectRoutes from '@/routes/projects';
import type { BreadcrumbItem } from '@/types';
import type { Board, GithubAccount } from '@/types/app';

type Props = {
    board: Board;
    githubAccounts: GithubAccount[];
    assignableMembers: AssignableMember[];
    mentionableMembers: MentionableUser[];
};

export default function BoardShow({
    board,
    githubAccounts,
    assignableMembers,
    mentionableMembers,
}: Props) {
    const [showSettings, setShowSettings] = useState(false);
    const resolvedMentionableMembers = useMemo(
        () => resolveMentionableMembers(board, mentionableMembers),
        [board, mentionableMembers],
    );
    const resolvedAssignableMembers = useMemo(
        () => resolveAssignableMembers(board, assignableMembers),
        [board, assignableMembers],
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
                    mentionableMembers={resolvedMentionableMembers}
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
                    mentionableMembers={resolvedMentionableMembers}
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
                assignableMembers={resolvedAssignableMembers}
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
