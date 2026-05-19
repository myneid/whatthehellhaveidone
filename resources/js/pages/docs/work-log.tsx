import { Head, Link } from '@inertiajs/react';
import {
    Bot,
    BookOpen,
    CalendarRange,
    Clock,
    Download,
    Filter,
    FolderKanban,
    Hash,
    History,
    NotebookPen,
    PenLine,
    Search,
    Sparkles,
    Tag,
    Timer,
    Upload,
} from 'lucide-react';
import { DocsCodeBlock } from '@/components/docs/docs-code-block';
import { DocsConceptCard } from '@/components/docs/docs-concept-card';
import { DocsFeatureGrid } from '@/components/docs/docs-feature-grid';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsHierarchyDiagram } from '@/components/docs/docs-hierarchy-diagram';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsSectionHeader } from '@/components/docs/docs-section-header';
import { DocsStepCard } from '@/components/docs/docs-step-card';
import { DocsTipList } from '@/components/docs/docs-tip-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DocsLayout from '@/layouts/docs-layout';

const stats = [
    { label: 'Sources', value: '3+' },
    { label: 'Linking', value: '#tags' },
    { label: 'Export', value: 'CSV/JSON' },
];

const capabilities = [
    {
        icon: NotebookPen,
        title: 'Personal journal',
        description: 'Capture what you worked on in plain text — your timeline across the workspace.',
    },
    {
        icon: Hash,
        title: 'Hashtag linking',
        description: 'Tag entries with #project-alias to associate work with a project automatically.',
    },
    {
        icon: Timer,
        title: 'Time tracking',
        description: 'Optional duration on manual entries, or started/ended timestamps via API and MCP.',
    },
    {
        icon: Sparkles,
        title: 'Automatic entries',
        description: 'Card moves and creates can log themselves — no extra typing required.',
    },
];

const filterOptions = [
    {
        icon: Search,
        title: 'Search',
        description: 'Filter entries by text in the body.',
    },
    {
        icon: CalendarRange,
        title: 'Date range',
        description: 'Narrow to a from/to date — also applies to exports.',
    },
    {
        icon: Tag,
        title: 'Source',
        description: 'Manual, API, card activity, GitHub, and other entry sources.',
    },
    {
        icon: Download,
        title: 'Export',
        description: 'Download filtered entries as CSV or JSON for reports and time tools.',
    },
];

const mcpExamples = [
    {
        title: 'Log time with a project tag',
        description: (
            <>
                &ldquo;Log 2 hours of backend work on the auth system{' '}
                <code>#myproject</code>&rdquo;
            </>
        ),
    },
    {
        title: 'Review today',
        description: '&ldquo;What did I work on today?&rdquo;',
    },
    {
        title: 'Pull a specific day',
        description: '&ldquo;Show my work log for last Monday&rdquo;',
    },
];

export default function DocsWorkLog() {
    return (
        <>
            <Head title="Work Log – Docs" />

            <div className="not-prose space-y-12">
                <DocsHero
                    eyebrow="Productivity"
                    eyebrowIcon={BookOpen}
                    title="Work Log"
                    description="A journal for tracking what you've worked on — link entries to projects with hashtags, filter your history, and export for reports."
                    stats={stats}
                    actions={
                        <>
                            <Button variant="brand" asChild>
                                <Link href="/work-log">Open Work Log</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/docs/mcp-setup">MCP setup</Link>
                            </Button>
                        </>
                    }
                />

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={BookOpen}
                        title="What it does"
                        description="Four ways the work log helps you stay on top of activity."
                    />
                    <DocsFeatureGrid features={capabilities} columns={2} />
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Hash}
                        title="How entries connect"
                        description="From a line of text to project context on your timeline."
                    />
                    <DocsHierarchyDiagram
                        levels={[
                            {
                                icon: PenLine,
                                label: 'Entry',
                                description: 'What you did',
                            },
                            {
                                icon: Hash,
                                label: 'Hashtag',
                                description: '#project-alias',
                            },
                            {
                                icon: FolderKanban,
                                label: 'Project',
                                description: 'Auto-linked',
                            },
                            {
                                icon: History,
                                label: 'Timeline',
                                description: 'Filter & export',
                            },
                        ]}
                    />
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={NotebookPen}
                        title="Creating entries"
                        description="Write entries from the app or let your AI assistant log for you."
                    />

                    <DocsStepCard step={1} title="Open Work Log" icon={BookOpen}>
                        <p>
                            Click <strong>Work Log</strong> in the main navigation, or go
                            directly to{' '}
                            <Link href="/work-log" className="hover-docs-link">
                                /work-log
                            </Link>
                            .
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={2} title="Write a new entry" icon={PenLine}>
                        <p>
                            Click <strong>New Entry</strong> and describe what you did. Use
                            hashtags like <code>#client-portal</code> to link the entry to a
                            project.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={3} title="Add time (optional)" icon={Timer} isLast>
                        <p>
                            Enter <strong>Time spent (minutes)</strong> on manual entries to
                            track duration. For precise start/end times, use the{' '}
                            <Link href="/docs/mcp-setup" className="hover-docs-link">
                                MCP server
                            </Link>{' '}
                            or API with <code>started_at</code> and <code>ended_at</code>.
                        </p>
                    </DocsStepCard>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Hash}
                        title="Hashtag linking"
                        description="Associate entries with projects using #tags in the body."
                    />
                    <DocsCodeBlock>
                        {`Fixed the login redirect bug #client-portal`}
                    </DocsCodeBlock>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                        Hashtags are matched against{' '}
                        <strong>project aliases</strong> configured on each project. When a
                        match is found, the entry is linked to that project automatically. See{' '}
                        <Link href="/docs/boards" className="hover-docs-link">
                            Projects & Boards
                        </Link>{' '}
                        for how projects are organized.
                    </p>
                </section>

                <div className="grid gap-4 lg:grid-cols-2">
                    <DocsConceptCard icon={Clock} title="Time tracking">
                        <p>
                            Manual entries support a duration in minutes from the New Entry
                            dialog.
                        </p>
                        <p>
                            MCP and API entries can also set{' '}
                            <code>started_at</code>, <code>ended_at</code>, or{' '}
                            <code>duration_seconds</code> for finer-grained tracking.
                        </p>
                    </DocsConceptCard>

                    <DocsConceptCard icon={Sparkles} title="Automatic card activity">
                        <p>
                            When you create or move cards on a{' '}
                            <Link href="/docs/boards" className="hover-docs-link">
                                board
                            </Link>
                            , the system can log entries on your behalf — linked to the
                            project, board, and card.
                        </p>
                        <p>
                            These appear alongside manual entries and are filterable by source.
                        </p>
                    </DocsConceptCard>
                </div>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Filter}
                        title="Filtering and export"
                        description="Find what you need, then pull it out for reporting."
                    />
                    <DocsFeatureGrid features={filterOptions} columns={2} />
                    <p className="text-sm text-muted-foreground">
                        Use the <strong>CSV</strong> or <strong>JSON</strong> buttons on the
                        Work Log page to export entries — date filters apply to the download.
                    </p>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Bot}
                        title="Using the MCP server"
                        description="Let your AI assistant log and query work on your behalf."
                    />
                    <DocsTipList tips={mcpExamples} />
                    <p className="text-sm text-muted-foreground">
                        Set up MCP in{' '}
                        <Link href="/docs/mcp-setup" className="hover-docs-link">
                            MCP Setup
                        </Link>{' '}
                        to enable tools like <code>create_work_log_entry</code> and{' '}
                        <code>get_daily_work_log</code>.
                    </p>
                </section>

                <Card className="border-border bg-muted/30">
                    <CardContent className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-semibold text-foreground">
                                Start logging today
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Open the Work Log, write your first entry, and tag it with a
                                project hashtag.
                            </p>
                        </div>
                        <Button variant="brand" asChild className="shrink-0">
                            <Link href="/work-log">Open Work Log</Link>
                        </Button>
                    </CardContent>
                </Card>

                <DocsNextSteps
                    steps={[
                        {
                            title: 'MCP Setup',
                            description: 'Connect Claude or ChatGPT to log work via AI.',
                            href: '/docs/mcp-setup',
                            icon: Bot,
                        },
                        {
                            title: 'Projects & Boards',
                            description: 'Organize work and auto-log card activity.',
                            href: '/docs/boards',
                            icon: FolderKanban,
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

DocsWorkLog.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
