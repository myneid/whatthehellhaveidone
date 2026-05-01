import { Link, usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { index as notificationsIndex } from '@/routes/notifications';
import type { Auth, BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage().props as { auth: Auth };
    const unreadNotificationsCount = auth.unreadNotificationsCount ?? 0;

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={notificationsIndex()}
                        className="group relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors hover:bg-accent"
                    >
                        <Bell className="!size-5 opacity-80 group-hover:opacity-100" />
                        {unreadNotificationsCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                                {unreadNotificationsCount > 9
                                    ? '9+'
                                    : unreadNotificationsCount}
                            </span>
                        )}
                        <span className="sr-only">Notifications</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Notifications</p>
                </TooltipContent>
            </Tooltip>
        </header>
    );
}
