import { useEffect, useState } from 'react';
import type { MentionableUser } from '@/hooks/use-mention-autocomplete';
import {
    resolveAssignableMembers,
    resolveMentionableMembers,
} from '@/lib/board-member-lists';
import type { Board } from '@/types/app';

type CollaboratorsResponse = {
    mentionable_members?: MentionableUser[];
    assignable_members?: MentionableUser[];
};

function collaboratorsUrl(board: Board): string {
    const slug = board.slug?.toString().trim();

    if (slug) {
        return `/boards/${encodeURIComponent(slug)}/collaborators`;
    }

    return `/boards/${board.id}/collaborators`;
}

async function fetchCollaborators(
    board: Board,
    signal: AbortSignal,
): Promise<CollaboratorsResponse | null> {
    const response = await fetch(collaboratorsUrl(board), {
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
        },
        signal,
    });

    if (!response.ok) {
        return null;
    }

    return (await response.json()) as CollaboratorsResponse;
}

export function useBoardCollaborators(
    board: Board,
    seedMentionableMembers: MentionableUser[],
    seedAssignableMembers: MentionableUser[],
    enabled: boolean,
): {
    mentionableMembers: MentionableUser[];
    assignableMembers: MentionableUser[];
} {
    const [mentionableMembers, setMentionableMembers] = useState(() =>
        resolveMentionableMembers(board, seedMentionableMembers),
    );
    const [assignableMembers, setAssignableMembers] = useState(() =>
        resolveAssignableMembers(board, seedAssignableMembers),
    );

    useEffect(() => {
        const resolvedMentionable = resolveMentionableMembers(
            board,
            seedMentionableMembers,
        );
        const resolvedAssignable = resolveAssignableMembers(
            board,
            seedAssignableMembers,
        );

        setMentionableMembers(resolvedMentionable);
        setAssignableMembers(resolvedAssignable);

        if (!enabled) {
            return;
        }

        const controller = new AbortController();

        void fetchCollaborators(board, controller.signal)
            .then((payload) => {
                if (!payload) {
                    return;
                }

                setMentionableMembers(
                    resolveMentionableMembers(
                        board,
                        payload.mentionable_members ?? resolvedMentionable,
                    ),
                );
                setAssignableMembers(
                    resolveAssignableMembers(
                        board,
                        payload.assignable_members ?? resolvedAssignable,
                    ),
                );
            })
            .catch(() => {});

        return () => {
            controller.abort();
        };
    }, [
        board,
        enabled,
        seedAssignableMembers,
        seedMentionableMembers,
    ]);

    return { mentionableMembers, assignableMembers };
}

export function useMentionableMembersForBoard(
    board: Board,
    seedMentionableMembers: MentionableUser[],
    enabled: boolean,
): MentionableUser[] {
    return useBoardCollaborators(
        board,
        seedMentionableMembers,
        [],
        enabled,
    ).mentionableMembers;
}
