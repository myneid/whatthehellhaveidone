import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';

export function NavUser() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();
    const getInitials = useInitials();

    if (!auth.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="sb-user-row"
                    data-test="sidebar-menu-button"
                >
                    <div className="sb-avatar">{getInitials(auth.user.name)}</div>
                    <div className="min-w-0 flex-1">
                        <span className="block truncate text-[12px] font-medium text-sidebar-foreground">
                            {auth.user.name}
                        </span>
                        <span className="block truncate font-mono text-[10px] text-sidebar-muted">
                            {auth.user.email.split('@')[0]}
                        </span>
                    </div>
                    <ChevronsUpDown className="size-3.5 shrink-0 text-sidebar-muted" strokeWidth={1.5} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="min-w-56 w-(--radix-dropdown-menu-trigger-width) rounded-lg"
                align="end"
                side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
            >
                <UserMenuContent user={auth.user} />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
