import { Link } from '@inertiajs/react';
import {
    ClipboardList,
    Columns3,
    FileText,
    KanbanSquare,
    LayoutGrid,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import type { NavItem, SidebarNavigation, SidebarProjectNavItem } from '@/types';

function projectIsActive(
    project: SidebarProjectNavItem,
    isCurrentUrl: (url: NonNullable<NavItem['href']>) => boolean,
): boolean {
    return (
        isCurrentUrl(project.href)
        || isCurrentUrl(project.documentsHref)
        || project.boards.some((board) => isCurrentUrl(board.href))
    );
}

function projectChildCount(project: SidebarProjectNavItem): number {
    return project.boards.length + 2;
}

function ProjectNavItem({
    project,
    isOpen,
    onToggle,
}: {
    project: SidebarProjectNavItem;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const { isCurrentUrl } = useCurrentUrl();
    const isActive = projectIsActive(project, isCurrentUrl);

    return (
        <div>
            <button
                type="button"
                className={cn(
                    'sb-proj-row',
                    (isOpen || isActive) && 'open',
                    isActive && 'active',
                )}
                onClick={onToggle}
                aria-expanded={isOpen}
            >
                <span className="sb-proj-toggle" aria-hidden>
                    ›
                </span>
                <span className="sb-proj-pip" />
                <span className="min-w-0 flex-1 truncate text-left">{project.name}</span>
                <span className="sb-proj-meta">{projectChildCount(project)}</span>
            </button>

            {isOpen && (
                <div className="sb-subtree">
                    <Link
                        href={project.href}
                        prefetch
                        className={cn('sb-sub-row', isCurrentUrl(project.href) && 'active')}
                    >
                        <LayoutGrid className="sb-icon" strokeWidth={1.5} aria-hidden />
                        <span>Overview</span>
                    </Link>

                    <Link
                        href={project.documentsHref}
                        prefetch
                        className={cn('sb-sub-row', isCurrentUrl(project.documentsHref) && 'active')}
                    >
                        <FileText className="sb-icon" strokeWidth={1.5} aria-hidden />
                        <span>Documents</span>
                    </Link>

                    {project.boards.map((board) => (
                        <Link
                            key={board.id}
                            href={board.href}
                            prefetch
                            className={cn('sb-sub-row', isCurrentUrl(board.href) && 'active')}
                        >
                            <Columns3 className="sb-icon" strokeWidth={1.5} aria-hidden />
                            <span className="truncate">{board.name}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export function NavMain({
    items = [],
    navigation,
}: {
    items: NavItem[];
    navigation?: SidebarNavigation;
}) {
    const { isCurrentUrl, currentUrl } = useCurrentUrl();
    const [openProjectId, setOpenProjectId] = useState<number | null>(null);

    useEffect(() => {
        const activeProject = navigation?.projects.find((project) =>
            projectIsActive(project, isCurrentUrl),
        );

        if (activeProject) {
            setOpenProjectId(activeProject.id);
        }
    }, [navigation?.projects, currentUrl, isCurrentUrl]);

    return (
        <>
            <p className="sb-section-label">Platform</p>
            {items.map((item) => {
                const active = isCurrentUrl(item.href);
                const Icon = item.title === 'Work Log' ? ClipboardList : LayoutGrid;

                return (
                    <Link
                        key={item.title}
                        href={item.href}
                        prefetch
                        className={cn('sb-nav-row', active && 'active')}
                    >
                        <Icon className="sb-icon" strokeWidth={1.5} aria-hidden />
                        <span className="flex-1 pl-1.5">{item.title}</span>
                    </Link>
                );
            })}

            <hr className="sb-divider" />

            <p className="sb-section-label">Projects</p>

            {navigation?.standaloneBoards.map((board) => (
                <Link
                    key={board.id}
                    href={board.href}
                    prefetch
                    className={cn('sb-nav-row', isCurrentUrl(board.href) && 'active')}
                >
                    <KanbanSquare className="sb-icon" strokeWidth={1.5} aria-hidden />
                    <span className="flex-1 truncate pl-1.5">{board.name}</span>
                </Link>
            ))}

            {navigation?.projects.map((project) => (
                <ProjectNavItem
                    key={project.id}
                    project={project}
                    isOpen={openProjectId === project.id}
                    onToggle={() =>
                        setOpenProjectId((current) =>
                            current === project.id ? null : project.id,
                        )
                    }
                />
            ))}
        </>
    );
}
