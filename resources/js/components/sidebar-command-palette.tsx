import { router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ClipboardList,
    Columns3,
    FileText,
    LayoutGrid,
    Search,
    Settings,
} from 'lucide-react';
import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent as ReactKeyboardEvent,
    type ReactNode,
} from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { SidebarNavigation } from '@/types';

type CommandItem = {
    id: string;
    label: string;
    group: string;
    href: string;
    icon: ReactNode;
    keywords: string[];
};

function buildCommandItems(navigation: SidebarNavigation): CommandItem[] {
    const items: CommandItem[] = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            group: 'Platform',
            href: toUrl(dashboard()),
            icon: <LayoutGrid className="size-4" strokeWidth={1.5} aria-hidden />,
            keywords: ['home', 'main'],
        },
        {
            id: 'work-log',
            label: 'Work Log',
            group: 'Platform',
            href: '/work-log',
            icon: <ClipboardList className="size-4" strokeWidth={1.5} aria-hidden />,
            keywords: ['time', 'entries'],
        },
        {
            id: 'docs',
            label: 'Documentation',
            group: 'Platform',
            href: '/docs',
            icon: <BookOpen className="size-4" strokeWidth={1.5} aria-hidden />,
            keywords: ['help', 'guide'],
        },
        {
            id: 'settings',
            label: 'Settings',
            group: 'Platform',
            href: '/settings/profile',
            icon: <Settings className="size-4" strokeWidth={1.5} aria-hidden />,
            keywords: ['profile', 'account'],
        },
    ];

    for (const board of navigation.standaloneBoards) {
        items.push({
            id: `board-${board.id}`,
            label: board.name,
            group: 'Boards',
            href: toUrl(board.href),
            icon: <Columns3 className="size-4" strokeWidth={1.5} aria-hidden />,
            keywords: ['board', 'kanban'],
        });
    }

    for (const project of navigation.projects) {
        items.push({
            id: `project-${project.id}`,
            label: project.name,
            group: 'Projects',
            href: toUrl(project.href),
            icon: <LayoutGrid className="size-4" strokeWidth={1.5} aria-hidden />,
            keywords: ['overview', 'project'],
        });

        items.push({
            id: `project-${project.id}-docs`,
            label: `${project.name} — Documents`,
            group: 'Projects',
            href: toUrl(project.documentsHref),
            icon: <FileText className="size-4" strokeWidth={1.5} aria-hidden />,
            keywords: ['documents', 'docs', project.name.toLowerCase()],
        });

        for (const board of project.boards) {
            items.push({
                id: `project-${project.id}-board-${board.id}`,
                label: `${project.name} — ${board.name}`,
                group: 'Projects',
                href: toUrl(board.href),
                icon: <Columns3 className="size-4" strokeWidth={1.5} aria-hidden />,
                keywords: ['board', project.name.toLowerCase(), board.name.toLowerCase()],
            });
        }
    }

    return items;
}

function matchesQuery(item: CommandItem, query: string): boolean {
    if (query === '') {
        return true;
    }

    const haystack = [item.label, item.group, ...item.keywords]
        .join(' ')
        .toLowerCase();

    return query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((term) => haystack.includes(term));
}

type SidebarCommandPaletteProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function SidebarCommandPalette({
    open,
    onOpenChange,
}: SidebarCommandPaletteProps) {
    const { navigation } = usePage().props as { navigation: SidebarNavigation };
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const items = useMemo(
        () => buildCommandItems(navigation),
        [navigation],
    );

    const filteredItems = useMemo(
        () => items.filter((item) => matchesQuery(item, query)),
        [items, query],
    );

    const groupedItems = useMemo(() => {
        const groups = new Map<string, CommandItem[]>();

        for (const item of filteredItems) {
            const group = groups.get(item.group) ?? [];
            group.push(item);
            groups.set(item.group, group);
        }

        return groups;
    }, [filteredItems]);

    const flatFilteredItems = filteredItems;

    const navigateTo = useCallback(
        (href: string) => {
            onOpenChange(false);
            router.visit(href);
        },
        [onOpenChange],
    );

    useEffect(() => {
        if (! open) {
            setQuery('');
            setSelectedIndex(0);

            return;
        }

        const frame = requestAnimationFrame(() => {
            inputRef.current?.focus();
        });

        return () => cancelAnimationFrame(frame);
    }, [open]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const selected = listRef.current?.querySelector(
            '[data-command-selected="true"]',
        );

        selected?.scrollIntoView({ block: 'nearest' });
    }, [selectedIndex, flatFilteredItems.length]);

    const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedIndex((current) =>
                flatFilteredItems.length === 0
                    ? 0
                    : (current + 1) % flatFilteredItems.length,
            );

            return;
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex((current) =>
                flatFilteredItems.length === 0
                    ? 0
                    : (current - 1 + flatFilteredItems.length)
                        % flatFilteredItems.length,
            );

            return;
        }

        if (event.key === 'Enter' && flatFilteredItems[selectedIndex]) {
            event.preventDefault();
            navigateTo(flatFilteredItems[selectedIndex].href);
        }
    };

    let runningIndex = -1;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg [&>button]:hidden">
                <DialogTitle className="sr-only">Search navigation</DialogTitle>
                <div className="flex items-center gap-2 border-b px-3">
                    <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                    <Input
                        ref={inputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Search projects, boards, pages..."
                        className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
                    />
                    <kbd className="hidden rounded border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                        esc
                    </kbd>
                </div>

                <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
                    {flatFilteredItems.length === 0 ? (
                        <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                            No results found.
                        </p>
                    ) : (
                        Array.from(groupedItems.entries()).map(
                            ([group, groupItems]) => (
                                <div key={group} className="mb-2 last:mb-0">
                                    <p className="px-2 py-1.5 text-[11px] font-medium text-muted-foreground">
                                        {group}
                                    </p>
                                    <ul>
                                        {groupItems.map((item) => {
                                            runningIndex += 1;
                                            const itemIndex = runningIndex;
                                            const isSelected =
                                                itemIndex === selectedIndex;

                                            return (
                                                <li key={item.id}>
                                                    <button
                                                        type="button"
                                                        data-command-selected={
                                                            isSelected
                                                                ? 'true'
                                                                : undefined
                                                        }
                                                        className={cn(
                                                            'flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors',
                                                            isSelected
                                                                ? 'bg-accent text-accent-foreground'
                                                                : 'text-foreground hover:bg-accent/60',
                                                        )}
                                                        onMouseEnter={() =>
                                                            setSelectedIndex(
                                                                itemIndex,
                                                            )
                                                        }
                                                        onClick={() =>
                                                            navigateTo(item.href)
                                                        }
                                                    >
                                                        <span className="text-muted-foreground">
                                                            {item.icon}
                                                        </span>
                                                        <span className="truncate">
                                                            {item.label}
                                                        </span>
                                                    </button>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            ),
                        )
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function useSidebarCommandPaletteShortcut(
    setOpen: (open: boolean | ((current: boolean) => boolean)) => void,
): void {
    useEffect(() => {
        const onKeyDown = (event: globalThis.KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey)
                && event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setOpen((current) => ! current);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, [setOpen]);
}
