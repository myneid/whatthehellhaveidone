import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
};

export type SidebarBoardNavItem = {
    id: number;
    name: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type SidebarProjectNavItem = {
    id: number;
    name: string;
    href: NonNullable<InertiaLinkProps['href']>;
    documentsHref: NonNullable<InertiaLinkProps['href']>;
    boards: SidebarBoardNavItem[];
};

export type SidebarNavigation = {
    standaloneBoards: SidebarBoardNavItem[];
    projects: SidebarProjectNavItem[];
};
