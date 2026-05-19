import { Head, Link } from '@inertiajs/react';
import {
    Bot,
    Clock,
    Github,
    KanbanSquare,
    Layers,
    ListTodo,
    Rocket,
    Upload,
    UserPlus,
    Users,
} from 'lucide-react';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsStepCard } from '@/components/docs/docs-step-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DocsLayout from '@/layouts/docs-layout';

const stats = [
    { label: 'Steps', value: '5' },
    { label: 'Time', value: '~10 min' },
    { label: 'Cost', value: 'Free' },
];

export default function DocsGettingStarted() {
    return (
        <>
            <Head title="Getting Started – Docs" />

            <div className="not-prose space-y-12">
                <header className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-brand-sm">
                    <div className="border-b border-border bg-muted/30 px-6 py-3 sm:px-8">
                        <p className="flex items-center gap-2 text-sm font-semibold text-brand-yellow-text">
                            <Rocket className="size-4" />
                            Quick Start Guide
                        </p>
                    </div>

                    <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-2xl space-y-4">
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                                Getting started
                            </h1>
                            <p className="text-lg leading-relaxed text-muted-foreground">
                                Go from zero to a working board in five steps — account, project,
                                board, cards, and your team.
                            </p>
                            <div className="flex flex-wrap gap-3 pt-1">
                                <Button variant="brand" asChild>
                                    <Link href="/register">Create account</Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/docs">Back to docs</Link>
                                </Button>
                            </div>
                        </div>

                        <dl className="grid w-full shrink-0 grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-muted/20 sm:max-w-sm lg:w-auto">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="flex min-w-0 flex-col items-center justify-center px-3 py-4 sm:px-5"
                                >
                                    <dt className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        {stat.label}
                                    </dt>
                                    <dd className="mt-1.5 whitespace-nowrap text-lg font-bold tabular-nums text-foreground sm:text-xl">
                                        {stat.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </header>

                <section className="space-y-2">
                    <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="size-4" />
                        <span>Follow the timeline — top to bottom</span>
                    </div>

                    <DocsStepCard step={1} title="Create an account" icon={UserPlus}>
                        <p>
                            Register at <Link href="/register">/register</Link>. If your admin
                            already added you, just sign in with your existing account.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard
                        step={2}
                        title="Create a project"
                        icon={KanbanSquare}
                        highlights={['Name', 'Accent color']}
                    >
                        <p>
                            From the dashboard, click <strong>New Project</strong>. Projects group
                            boards under one team or product area.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard
                        step={3}
                        title="Create a board"
                        icon={Layers}
                        highlights={['private', 'team', 'public']}
                    >
                        <p>
                            Inside a project, click <strong>New Board</strong> for a Kanban-style
                            board. You can also create standalone boards from the dashboard.
                        </p>
                        <p>
                            Pick a visibility level and optional background color for the board
                            header.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard
                        step={4}
                        title="Add lists and cards"
                        icon={ListTodo}
                        highlights={[
                            'Drag & drop',
                            'Checklists',
                            'GitHub issues',
                        ]}
                    >
                        <p>
                            Use <strong>+ Add list</strong> for columns like To Do, In Progress,
                            and Done. Click <strong>+ Add card</strong> inside a list to create
                            tasks.
                        </p>
                        <p>
                            Open any card to edit details, assign members, set due dates, add
                            comments, and link GitHub issues. Drag cards between lists to update
                            status.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard
                        step={5}
                        title="Invite team members"
                        icon={Users}
                        isLast
                    >
                        <p>
                            Open a project and go to the <strong>Members</strong> tab to invite by
                            email or share an invitation link.
                        </p>
                        <p>
                            Manage board-level access from the board&apos;s{' '}
                            <strong>Settings</strong> sheet.
                        </p>
                    </DocsStepCard>
                </section>

                <Card className="border-border bg-muted/30">
                    <CardContent className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-semibold text-foreground">Ready to go?</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create your account and land on the dashboard in under a minute.
                            </p>
                        </div>
                        <Button variant="brand" asChild className="shrink-0">
                            <Link href="/register">Start for free</Link>
                        </Button>
                    </CardContent>
                </Card>

                <DocsNextSteps
                    steps={[
                        {
                            title: 'Connect an AI assistant',
                            description: 'Hook up Claude or ChatGPT via MCP.',
                            href: '/docs/mcp-setup',
                            icon: Bot,
                        },
                        {
                            title: 'GitHub integration',
                            description: 'Sync issues with board cards both ways.',
                            href: '/docs/github',
                            icon: Github,
                        },
                        {
                            title: 'Import from Trello',
                            description: 'Migrate existing boards in one click.',
                            href: '/docs/trello-import',
                            icon: Upload,
                        },
                    ]}
                />
            </div>
        </>
    );
}

DocsGettingStarted.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
