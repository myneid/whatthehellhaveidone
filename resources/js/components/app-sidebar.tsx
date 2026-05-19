import { Link, usePage } from '@inertiajs/react';
import { PanelLeftClose, Search } from 'lucide-react';
import { useState } from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import {
    SidebarCommandPalette,
    useSidebarCommandPaletteShortcut,
} from '@/components/sidebar-command-palette';
import { NavUser } from '@/components/nav-user';
import { Sidebar, useSidebar } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem, SidebarNavigation } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
    {
        title: 'Work Log',
        href: '/work-log',
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Documentation',
        href: '/docs',
    },
    {
        title: 'Settings',
        href: '/settings/profile',
    },
];

function SidebarBrandHeader() {
    const { toggleSidebar } = useSidebar();

    return (
        <div className="sb-brand-header">
            <Link href={dashboard()} prefetch className="sb-brand-lockup">
                <div className="sb-brand-icon">
                    <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
                        <path d="M6 1L11 10H1L6 1Z" fill="white" opacity="0.9" />
                    </svg>
                </div>
                <span className="sb-brand-name">WTHD</span>
            </Link>
            <button
                type="button"
                className="sb-collapse-btn"
                onClick={toggleSidebar}
                aria-label="Collapse sidebar"
            >
                <PanelLeftClose className="size-3.5" strokeWidth={1.5} />
            </button>
        </div>
    );
}

export function AppSidebar() {
    const { navigation } = usePage().props as { navigation: SidebarNavigation };
    const [commandOpen, setCommandOpen] = useState(false);

    useSidebarCommandPaletteShortcut(setCommandOpen);

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarCommandPalette
                open={commandOpen}
                onOpenChange={setCommandOpen}
            />
            <div className="sb-shell">
                <SidebarBrandHeader />

                <button
                    type="button"
                    className="sb-search"
                    aria-label="Open search"
                    onClick={() => setCommandOpen(true)}
                >
                    <Search className="size-3 shrink-0" strokeWidth={1.5} aria-hidden />
                    <span>Search...</span>
                    <kbd>⌘K</kbd>
                </button>

                <div className="sb-scroll">
                    <NavMain items={mainNavItems} navigation={navigation} />
                </div>

                <div className="sb-footer">
                    <NavFooter items={footerNavItems} />
                    <NavUser />
                </div>
            </div>
        </Sidebar>
    );
}
