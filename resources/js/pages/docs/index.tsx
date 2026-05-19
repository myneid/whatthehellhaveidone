import { Head, Link } from '@inertiajs/react';
import { BookOpen, Bot, Github, Kanban, MessageSquare, Upload, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
            <Head title="Documentation – What the HELL have I done">
                <meta
                    name="description"
                    content="A full-featured project management platform with built-in AI integration via MCP. Manage projects, boards, and cards — and let your AI assistant do it for you."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://whatthehellhaveidone.net/docs" />
                <meta
                    property="og:title"
                    content="Documentation – What the HELL have I done"
                />
                <meta
                    property="og:description"
                    content="A full-featured project management platform with built-in AI integration via MCP. Manage projects, boards, and cards — and let your AI assistant do it for you."
                />
                <meta
                    property="og:image"
                    content="https://whatthehellhaveidone.net/whatthehellhaveidone.png"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="Documentation – What the HELL have I done"
                />
                <meta
                    name="twitter:description"
                    content="A full-featured project management platform with built-in AI integration via MCP. Manage projects, boards, and cards — and let your AI assistant do it for you."
                />
                <meta
                    name="twitter:image"
                    content="https://whatthehellhaveidone.net/whatthehellhaveidone.png"
                />
            </Head>

            <div className="not-prose space-y-10">
                <header className="space-y-4 border-b-2 border-border pb-8">
                    <div className="flex items-center gap-2 text-sm font-semibold text-brand-yellow-text">
                        <BookOpen className="size-4" />
                        <span>Documentation</span>
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
                            What the <span className="text-brand-red">HELL</span> have i{' '}
                            <span className="text-brand-yellow-text">done</span>?
                        </h1>
                        <p className="max-w-2xl text-lg text-muted-foreground">
                            A full-featured project management platform with built-in AI integration
                            via the Model Context Protocol (MCP). Manage projects, boards, and
                            cards — and let your AI assistant do it for you.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <Button variant="brand" asChild>
                            <Link href="/docs/getting-started">Quick Start →</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/docs/mcp-setup">
                                <Bot className="size-4" />
                                MCP Setup
                            </Link>
                        </Button>
                    </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {topics.map((topic) => (
                        <Link key={topic.href} href={topic.href} className="group block">
                            <Card className="hover-docs-interactive h-full">
                                <CardHeader className="gap-3">
                                    <topic.icon className="size-5 text-muted-foreground transition-brand group-hover:scale-110 group-hover-docs-accent" />
                                    <CardTitle className="transition-brand group-hover-docs-bold">
                                        {topic.title}
                                    </CardTitle>
                                    <CardDescription>{topic.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>

                <Card className="border-border bg-muted/40">
                    <CardHeader>
                        <CardTitle>Hosted version</CardTitle>
                        <CardDescription>
                            Use the hosted version at{' '}
                            <a
                                href="https://whatthehellhaveidone.net"
                                className="hover-docs-link font-medium text-foreground"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                whatthehellhaveidone.net
                            </a>{' '}
                            or self-host — it&apos;s open source under the Unlicense.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </>
    );
}

DocsIndex.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
