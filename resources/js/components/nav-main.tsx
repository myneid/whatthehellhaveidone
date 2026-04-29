import { Link } from '@inertiajs/react';
import { ChevronRight, FolderOpen, KanbanSquare } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import type { NavItem, SidebarNavigation, SidebarProjectNavItem } from '@/types';

function ProjectMenuItem({ project }: { project: SidebarProjectNavItem }) {
    const { isCurrentUrl } = useCurrentUrl();

    const isProjectActive = isCurrentUrl(project.href) || project.boards.some((board) => isCurrentUrl(board.href));

    return (
        <Collapsible asChild defaultOpen={isProjectActive}>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton isActive={isProjectActive} tooltip={{ children: project.name }}>
                        <FolderOpen />
                        <span>{project.name}</span>
                        <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <SidebarMenuSub>
                        <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild isActive={isCurrentUrl(project.href)}>
                                <Link href={project.href} prefetch>
                                    <span>Overview</span>
                                </Link>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>

                        {project.boards.map((board) => (
                            <SidebarMenuSubItem key={board.id}>
                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(board.href)}>
                                    <Link href={board.href} prefetch>
                                        <span>{board.name}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    );
}

export function NavMain({ items = [], navigation }: { items: NavItem[]; navigation?: SidebarNavigation }) {
    const { isCurrentUrl } = useCurrentUrl();
    const mainHref = dashboard();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>

            <SidebarGroupLabel className="mt-3">Boards &amp; Projects</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        isActive={isCurrentUrl(mainHref)}
                        tooltip={{ children: 'Main' }}
                    >
                        <Link href={mainHref} prefetch>
                            <KanbanSquare />
                            <span>Main</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                {navigation?.standaloneBoards.map((board) => (
                    <SidebarMenuItem key={board.id}>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem>
                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(board.href)}>
                                    <Link href={board.href} prefetch>
                                        <span>{board.name}</span>
                                    </Link>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>
                    </SidebarMenuItem>
                ))}

                {navigation?.projects.map((project) => (
                    <ProjectMenuItem key={project.id} project={project} />
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
