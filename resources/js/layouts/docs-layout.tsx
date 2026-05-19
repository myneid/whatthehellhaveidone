import { Link } from '@inertiajs/react';
import { BookOpen, Menu } from 'lucide-react';
import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn } from '@/lib/utils';
import { login, register } from '@/routes';

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
            { title: 'GitHub Board Workflow', href: '/docs/github-workflow' },
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

function DocsNavLinks({ onNavigate }: { onNavigate?: () => void }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <div className="space-y-6">
            {sections.map((section) => (
                <div key={section.heading}>
                    <p className="docs-eyebrow mb-3 text-[10px] text-muted-foreground">
                        {section.heading}
                    </p>
                    <ul className="space-y-0.5">
                        {section.items.map((item) => {
                            const active = isCurrentUrl(item.href);

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onNavigate}
                                        className={cn(
                                            'docs-nav-item',
                                            active && 'docs-nav-item-active',
                                        )}
                                    >
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default function DocsLayout({ children }: PropsWithChildren) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="docs-shell relative min-h-screen bg-background">
            <div className="docs-ambient" aria-hidden />

            <header className="docs-header-bar sticky top-0 z-20">
                <div className="relative mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="lg:hidden">
                                <Menu className="size-4" />
                                <span className="sr-only">Open docs menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-72 overflow-y-auto">
                            <SheetHeader>
                                <SheetTitle className="flex items-center gap-2 text-left">
                                    <BookOpen className="size-4 text-foreground" />
                                    Documentation
                                </SheetTitle>
                            </SheetHeader>
                            <nav className="mt-6 px-1">
                                <DocsNavLinks onNavigate={() => setMobileOpen(false)} />
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="shrink-0 transition-brand hover:opacity-90">
                        <img
                            src="/whatthehellhaveidone.png"
                            alt="What the HELL have i DONE"
                            className="h-10 w-auto sm:h-11"
                        />
                    </Link>

                    <div className="hidden items-center gap-2 text-sm sm:flex">
                        <span className="text-muted-foreground">/</span>
                        <span className="flex items-center gap-1.5 font-semibold text-foreground">
                            <BookOpen className="size-3.5 text-muted-foreground" />
                            Documentation
                        </span>
                    </div>

                    <div className="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={login()}>Sign in</Link>
                        </Button>
                        <Button variant="brand" size="sm" asChild>
                            <Link href={register()}>Get started</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="relative z-10 mx-auto flex max-w-6xl gap-0 px-4 py-8 sm:px-6 sm:py-12">
                <aside className="hidden w-52 shrink-0 lg:block">
                    <nav className="docs-sidebar-panel sticky top-24 -ml-4 rounded-2xl py-4 pr-4 pl-4">
                        <DocsNavLinks />
                    </nav>
                </aside>

                <main className="min-w-0 flex-1 lg:pl-12">
                    <div className="docs-prose">{children}</div>
                </main>
            </div>
        </div>
    );
}
