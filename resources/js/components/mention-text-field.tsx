import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    
    useMentionAutocomplete
} from '@/hooks/use-mention-autocomplete';
import type {MentionableUser} from '@/hooks/use-mention-autocomplete';
import { cn } from '@/lib/utils';

type BaseProps = {
    members: MentionableUser[];
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
    id?: string;
    autoFocus?: boolean;
};

type InputProps = BaseProps & {
    multiline?: false;
} & Omit<React.ComponentProps<'input'>, 'value' | 'onChange'>;

type TextareaProps = BaseProps & {
    multiline: true;
    rows?: number;
} & Omit<React.ComponentProps<'textarea'>, 'value' | 'onChange'>;

type Props = InputProps | TextareaProps;

const inputClassName =
    'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-xl border-2 bg-transparent px-3 py-1 text-base shadow-brand-sm transition-brand outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm hover:border-foreground/30 hover:shadow-brand-sm focus-visible:border-ring focus-visible:shadow-brand-sm focus-visible:ring-ring/40 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive';

function MentionSuggestions({
    members,
    highlightedIndex,
    onHighlight,
    onSelect,
}: {
    members: MentionableUser[];
    highlightedIndex: number;
    onHighlight: (index: number) => void;
    onSelect: (member: MentionableUser) => void;
}) {
    return (
        <ul
            role="listbox"
            className="absolute top-full z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border bg-popover py-1 shadow-md"
        >
            {members.map((member, index) => (
                <li
                    key={member.id}
                    role="option"
                    aria-selected={index === highlightedIndex}
                >
                    <button
                        type="button"
                        className={cn(
                            'flex w-full items-center gap-2 px-3 py-2 text-left text-sm',
                            index === highlightedIndex
                                ? 'bg-accent text-accent-foreground'
                                : 'hover:bg-accent/50',
                        )}
                        onMouseDown={(event) => {
                            event.preventDefault();
                        }}
                        onMouseEnter={() => onHighlight(index)}
                        onClick={() => onSelect(member)}
                    >
                        <Avatar className="size-6">
                            {member.avatar ? (
                                <AvatarImage
                                    src={member.avatar}
                                    alt={member.name}
                                />
                            ) : null}
                            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
                                {member.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <span>{member.name}</span>
                    </button>
                </li>
            ))}
        </ul>
    );
}

export function MentionTextField(props: Props) {
    const {
        members,
        value,
        onValueChange,
        className,
        placeholder,
        disabled,
        id,
        autoFocus,
    } = props;
    const fieldRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const {
        suggestions,
        isOpen,
        highlightedIndex,
        setHighlightedIndex,
        selectMember,
        handleKeyDown,
        handleSelect,
        handleChange,
    } = useMentionAutocomplete({
        members,
        value,
        onValueChange,
    });

    function applySelection(member: MentionableUser) {
        const nextCursor = selectMember(member);

        requestAnimationFrame(() => {
            const field = fieldRef.current;

            if (!field || nextCursor === null) {
                return;
            }

            field.setSelectionRange(nextCursor, nextCursor);
            field.focus();
        });
    }

    const sharedHandlers = {
        onClick: (
            event: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
            handleSelect(event.currentTarget);
        },
        onKeyUp: (
            event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
            handleSelect(event.currentTarget);
        },
        onSelect: (
            event: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>,
        ) => {
            handleSelect(event.currentTarget);
        },
    };

    return (
        <div className="relative w-full">
            {props.multiline ? (
                <textarea
                    ref={fieldRef as React.RefObject<HTMLTextAreaElement>}
                    id={id}
                    value={value}
                    rows={props.rows ?? 5}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    className={cn(
                        'w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40',
                        className,
                    )}
                    onChange={(event) => {
                        handleChange(event);
                        onValueChange(event.target.value);
                    }}
                    onKeyDown={(event) => handleKeyDown(event, true)}
                    {...sharedHandlers}
                />
            ) : (
                <input
                    ref={fieldRef as React.RefObject<HTMLInputElement>}
                    id={id}
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    className={cn(inputClassName, className)}
                    onChange={(event) => {
                        handleChange(event);
                        onValueChange(event.target.value);
                    }}
                    onKeyDown={(event) => handleKeyDown(event, false)}
                    {...sharedHandlers}
                />
            )}

            {isOpen ? (
                <MentionSuggestions
                    members={suggestions}
                    highlightedIndex={highlightedIndex}
                    onHighlight={setHighlightedIndex}
                    onSelect={applySelection}
                />
            ) : null}
        </div>
    );
}
