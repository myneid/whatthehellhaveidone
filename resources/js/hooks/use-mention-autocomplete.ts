import { useCallback, useMemo, useState } from 'react';

export type MentionableUser = {
    id: number;
    name: string;
    avatar?: string | null;
};

type MentionContext = {
    query: string;
    startIndex: number;
};

export function getActiveMention(
    value: string,
    cursorPosition: number,
): MentionContext | null {
    const textBeforeCursor = value.slice(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex === -1) {
        return null;
    }

    if (atIndex > 0 && !/\s/.test(textBeforeCursor[atIndex - 1] ?? '')) {
        return null;
    }

    const query = textBeforeCursor.slice(atIndex + 1);

    if (query.includes('\n')) {
        return null;
    }

    return { query, startIndex: atIndex };
}

export function filterMentionableUsers(
    members: MentionableUser[],
    query: string,
): MentionableUser[] {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
        return members;
    }

    return members.filter((member) =>
        member.name.toLowerCase().includes(normalizedQuery),
    );
}

export function insertMention(
    value: string,
    startIndex: number,
    cursorPosition: number,
    name: string,
): { value: string; cursorPosition: number } {
    const before = value.slice(0, startIndex);
    const after = value.slice(cursorPosition);
    const mention = `@${name} `;
    const nextValue = `${before}${mention}${after}`;

    return {
        value: nextValue,
        cursorPosition: before.length + mention.length,
    };
}

type UseMentionAutocompleteOptions = {
    members: MentionableUser[];
    value: string;
    onValueChange: (value: string) => void;
    onCursorChange?: (position: number) => void;
};

export function useMentionAutocomplete({
    members,
    value,
    onValueChange,
    onCursorChange,
}: UseMentionAutocompleteOptions) {
    const [cursorPosition, setCursorPosition] = useState(0);
    const [highlightedIndex, setHighlightedIndex] = useState(0);

    const mentionContext = useMemo(
        () => getActiveMention(value, cursorPosition),
        [value, cursorPosition],
    );

    const suggestions = useMemo(() => {
        if (!mentionContext) {
            return [];
        }

        return filterMentionableUsers(members, mentionContext.query);
    }, [members, mentionContext]);

    const isOpen = mentionContext !== null && suggestions.length > 0;

    const updateCursor = useCallback(
        (position: number) => {
            setCursorPosition(position);
            onCursorChange?.(position);
        },
        [onCursorChange],
    );

    const selectMember = useCallback(
        (member: MentionableUser): number | null => {
            if (!mentionContext) {
                return null;
            }

            const result = insertMention(
                value,
                mentionContext.startIndex,
                cursorPosition,
                member.name,
            );

            onValueChange(result.value);
            updateCursor(result.cursorPosition);
            setHighlightedIndex(0);

            return result.cursorPosition;
        },
        [cursorPosition, mentionContext, onValueChange, updateCursor, value],
    );

    const handleKeyDown = useCallback(
        (
            event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
            multiline = false,
        ) => {
            if (!isOpen) {
                return;
            }

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                setHighlightedIndex(
                    (index) => (index + 1) % suggestions.length,
                );

                return;
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setHighlightedIndex(
                    (index) =>
                        (index - 1 + suggestions.length) % suggestions.length,
                );

                return;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                updateCursor(cursorPosition);

                return;
            }

            const shouldSelectOnEnter =
                event.key === 'Enter' && (!multiline || !event.shiftKey);
            const shouldSelectOnTab = event.key === 'Tab';

            if (shouldSelectOnEnter || shouldSelectOnTab) {
                event.preventDefault();
                const member = suggestions[highlightedIndex];

                if (member) {
                    selectMember(member);
                }
            }
        },
        [
            cursorPosition,
            highlightedIndex,
            isOpen,
            selectMember,
            suggestions,
            updateCursor,
        ],
    );

    const handleSelect = useCallback(
        (target: HTMLInputElement | HTMLTextAreaElement) => {
            updateCursor(target.selectionStart ?? target.value.length);
        },
        [updateCursor],
    );

    const handleChange = useCallback(
        (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
        ) => {
            onChange?.(event);
            updateCursor(
                event.target.selectionStart ?? event.target.value.length,
            );
            setHighlightedIndex(0);
        },
        [updateCursor],
    );

    return {
        suggestions,
        isOpen,
        highlightedIndex,
        setHighlightedIndex,
        selectMember,
        handleKeyDown,
        handleSelect,
        handleChange,
    };
}
