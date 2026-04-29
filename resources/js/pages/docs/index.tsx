import { Head, Link } from '@inertiajs/react';
import { BookOpen, Bot, Github, Kanban, MessageSquare, Upload, Zap } from 'lucide-react';
import DocsLayout from '@/layouts/docs-layout';

const topics = [
    {
        icon: Kanban,
        title: 'Projects & Boards',
        description: 'Create projects, organize boards, and manage cards with drag-and-drop.',
        href: '/docs/getting-started',
    },
    {
        icon: Bot,
        title: 'MCP Setup',
        description: 'Connect Claude, ChatGPT, or any MCP-compatible AI to your workspace.',
        href: '/docs/mcp-setup',
    },
    {
        icon: Github,
        title: 'GitHub Integration',
        description: 'Sync GitHub issues with board cards, bi-directionally.',
        href: '/docs/github',
    },
    {
        icon: MessageSquare,
        title: 'Discord Notifications',
        description: 'Get notified in Discord when cards are created or moved.',
        href: '/docs/discord',
    },
    {
        icon: Upload,
        title: 'Trello Import',
        description: 'Migrate your Trello boards in one click.',
        href: '/docs/trello-import',
    },
    {
        icon: Zap,
        title: 'Work Log',
        description: 'Track time and activity across projects with hashtag-based logging.',
        href: '/docs/work-log',
    },
];

export default function DocsIndex() {
    return (
        <>
            <Head title="Documentation" />

            <div className="space-y-10 not-prose">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <BookOpen className="h-4 w-4" />
                        <span>Documentation</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">What the HELL have I done?</h1>
                    <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
                        A full-featured project management platform with built-in AI integration via the Model Context Protocol (MCP).
                        Manage projects, boards, and cards — and let your AI assistant do it for you.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Link
                            href="/docs/getting-started"
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            Quick Start →
                        </Link>
                        <Link
                            href="/docs/mcp-setup"
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            <Bot className="h-4 w-4" />
                            MCP Setup
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {topics.map((topic) => (
                        <Link
                            key={topic.href}
                            href={topic.href}
                            className="group rounded-xl border p-5 hover:border-primary/50 hover:bg-muted/30 transition-colors"
                        >
                            <topic.icon className="mb-3 h-5 w-5 text-primary" />
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {topic.title}
                            </h3>
                            <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
                        </Link>
                    ))}
                </div>

                <div className="rounded-xl border bg-muted/30 p-6">
                    <h2 className="font-semibold mb-2">Hosted Version</h2>
                    <p className="text-sm text-muted-foreground">
                        Use the hosted version at{' '}
                        <a href="https://whatthehellhaveidone.net" className="text-primary underline" target="_blank" rel="noopener noreferrer">
                            whatthehellhaveidone.net
                        </a>
                        {' '}or self-host — it's open source under the Unlicense.
                    </p>
                </div>
            </div>
        </>
    );
}

DocsIndex.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
