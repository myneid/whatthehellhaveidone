import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

const sections = [
    {
        heading: 'Getting Started',
        items: [
            { title: 'Introduction', href: '/docs' },
            { title: 'Quick Start', href: '/docs/getting-started' },
        ],
    },
    {
        heading: 'Features',
        items: [
            { title: 'Projects & Boards', href: '/docs/boards' },
            { title: 'GitHub Integration', href: '/docs/github' },
            { title: 'Discord Notifications', href: '/docs/discord' },
            { title: 'Trello Import', href: '/docs/trello-import' },
            { title: 'Work Log', href: '/docs/work-log' },
        ],
    },
    {
        heading: 'AI & MCP',
        items: [
            { title: 'MCP Setup', href: '/docs/mcp-setup' },
            { title: 'Available Tools', href: '/docs/mcp-tools' },
        ],
    },
];

export default function DocsLayout({ children }: PropsWithChildren) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="min-h-screen bg-background">
            {/* Top nav */}
            <header className="border-b sticky top-0 z-10 bg-background/95 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/whatthehellhaveidone.png" alt="Logo" className="h-7 w-auto" />
                    </Link>
                    <span className="text-muted-foreground">/</span>
                    <span className="text-sm font-medium">Documentation</span>
                    <div className="ml-auto flex gap-3">
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Sign in</Link>
                        <Link href="/register" className="text-sm font-medium text-primary hover:underline">Get started</Link>
                    </div>
                </div>
            </header>

            <div className="mx-auto flex max-w-6xl gap-0 px-6 py-10">
                {/* Sidebar */}
                <nav className="hidden w-52 shrink-0 lg:block">
                    <div className="sticky top-20 space-y-6 pr-4">
                        {sections.map((section) => (
                            <div key={section.heading}>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                    {section.heading}
                                </p>
                                <ul className="space-y-1">
                                    {section.items.map((item) => (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    'block rounded-md px-3 py-1.5 text-sm transition-colors',
                                                    currentPath === item.href
                                                        ? 'bg-primary/10 text-primary font-medium'
                                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                                                )}
                                            >
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </nav>

                {/* Content */}
                <main className="min-w-0 flex-1 lg:pl-10">
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
