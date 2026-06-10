import type { MentionableUser } from '@/hooks/use-mention-autocomplete';
import type { Board, BoardMember, ProjectMember } from '@/types/app';

type UserLike = {
    id: number;
    name: string;
    avatar?: string | null;
};

function addUser(
    byId: Map<number, MentionableUser>,
    user: UserLike | null | undefined,
): void {
    if (!user?.id || !user.name) {
        return;
    }

    byId.set(user.id, {
        id: user.id,
        name: user.name,
        avatar: user.avatar ?? null,
    });
}

function addBoardMember(
    byId: Map<number, MentionableUser>,
    member: BoardMember,
    assignableOnly: boolean,
): void {
    if (assignableOnly && member.role === 'viewer') {
        return;
    }

    addUser(byId, member.user);
}

function addProjectMember(
    byId: Map<number, MentionableUser>,
    member: ProjectMember,
    assignableOnly: boolean,
): void {
    if (assignableOnly && member.role === 'viewer') {
        return;
    }

    addUser(byId, member.user);
}

function resolveMembers(
    board: Board,
    members: MentionableUser[],
    assignableOnly: boolean,
): MentionableUser[] {
    const byId = new Map<number, MentionableUser>();

    members.forEach((member) => byId.set(member.id, member));
    addUser(byId, board.owner);

    for (const member of board.members ?? []) {
        addBoardMember(byId, member, assignableOnly);
    }

    for (const member of board.project?.members ?? []) {
        addProjectMember(byId, member, assignableOnly);
    }

    return Array.from(byId.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
    );
}

export function resolveMentionableMembers(
    board: Board,
    mentionableMembers: MentionableUser[],
): MentionableUser[] {
    return resolveMembers(board, mentionableMembers, false);
}

export function resolveAssignableMembers(
    board: Board,
    assignableMembers: MentionableUser[],
): MentionableUser[] {
    return resolveMembers(board, assignableMembers, true);
}
