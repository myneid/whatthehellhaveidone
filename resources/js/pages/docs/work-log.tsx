import { Head, Link } from '@inertiajs/react';
import {
    Bot,
    BookOpen,
    Download,
    FolderKanban,
    Hash,
    NotebookPen,
    Sparkles,
    Timer,
    Upload,
} from 'lucide-react';
import { DocsCodeCallout } from '@/components/docs/docs-code-callout';
import { DocsCompactSteps } from '@/components/docs/docs-compact-steps';
import { DocsConceptCard } from '@/components/docs/docs-concept-card';
import { DocsCtaCard } from '@/components/docs/docs-cta-card';
import { DocsFeatureGrid } from '@/components/docs/docs-feature-grid';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsPageSection } from '@/components/docs/docs-page-section';
import { DocsTipList } from '@/components/docs/docs-tip-list';
import { Button } from '@/components/ui/button';
import DocsLayout from '@/layouts/docs-layout';

const stats = [
    { label: 'Sources', value: '3+' },
    { label: 'Linking', value: '#tags' },
    { label: 'Export', value: 'CSV/JSON' },
];

const highlights = [
    {
        icon: NotebookPen,
        title: 'Manual entries',
        description: 'Write what you did — optional minutes tracked in the New Entry dialog.',
    },
    {
        icon: Hash,
        title: 'Hashtag linking',
        description: '#project-alias tags auto-link entries to the matching project.',
    },
    {
        icon: Sparkles,
        title: 'Auto from boards',
        description: 'Card creates and moves log themselves, linked to project and card.',
    },
    {
        icon: Timer,
        title: 'API & MCP',
        description: 'AI assistants can log time, query history, and set precise durations.',
    },
];

const mcpExamples = [
    {
        title: 'Log with a tag',
        description: (
            <>
                &ldquo;Log 2 hours on auth #myproject&rdquo;
            </>
        ),
    },
    {
        title: 'Review today',
        description: '&ldquo;What did I work on today?&rdquo;',
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
                    description="Track what you've worked on — tag projects with hashtags, filter your history, and export to CSV or JSON."
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

                <DocsPageSection
                    icon={BookOpen}
                    title="At a glance"
                    description="Four ways entries land in your timeline."
                >
                    <DocsFeatureGrid features={highlights} columns={2} />
                </DocsPageSection>

                <DocsPageSection
                    icon={NotebookPen}
                    title="Quick start"
                    description="Three steps to your first entry."
                >
                    <DocsCompactSteps
                        steps={[
                            {
                                title: 'Open Work Log',
                                description: (
                                    <>
                                        From the nav or{' '}
                                        <Link href="/work-log" className="hover-docs-link">
                                            /work-log
                                        </Link>
                                        , click <strong>New Entry</strong>.
                                    </>
                                ),
                            },
                            {
                                title: 'Write and tag',
                                description: (
                                    <>
                                        Describe the work. Add a hashtag like{' '}
                                        <code>#client-portal</code> to link a project.
                                    </>
                                ),
                            },
                            {
                                title: 'Optional: time spent',
                                description: (
                                    <>
                                        Enter minutes in the dialog, or use{' '}
                                        <Link href="/docs/mcp-tools" className="hover-docs-link">
                                            MCP tools
                                        </Link>{' '}
                                        for <code>started_at</code> /{' '}
                                        <code>ended_at</code> timestamps.
                                    </>
                                ),
                            },
                        ]}
                    />
                </DocsPageSection>

                <DocsPageSection icon={Hash} title="Hashtag linking">
                    <DocsCodeCallout code="Fixed the login redirect bug #client-portal">
                        Tags match <strong>project aliases</strong> on each project — when
                        found, the entry links automatically. See{' '}
                        <Link href="/docs/boards" className="hover-docs-link">
                            Projects & Boards
                        </Link>{' '}
                        for project setup.
                    </DocsCodeCallout>
                </DocsPageSection>

                <div className="grid gap-4 lg:grid-cols-2">
                    <DocsConceptCard icon={Download} title="Filter & export">
                        <p>
                            Search entries, filter by date range or source (manual, API, card
                            activity, GitHub), then download as <strong>CSV</strong> or{' '}
                            <strong>JSON</strong> — date filters apply to exports.
                        </p>
                    </DocsConceptCard>

                    <DocsConceptCard icon={Bot} title="MCP & AI">
                        <p>
                            Tools like <code>create_work_log_entry</code> and{' '}
                            <code>get_daily_work_log</code> let assistants log and query on
                            your behalf. See{' '}
                            <Link href="/docs/mcp-tools" className="hover-docs-link">
                                MCP Tools
                            </Link>
                            .
                        </p>
                    </DocsConceptCard>
                </div>

                <DocsPageSection
                    icon={Bot}
                    title="Example prompts"
                    description="Once MCP is connected, try asking:"
                >
                    <DocsTipList tips={mcpExamples} />
                </DocsPageSection>

                <DocsCtaCard
                    title="Start logging today"
                    description="Open the Work Log, write your first entry, and tag it with a project hashtag."
                    actionLabel="Open Work Log"
                    actionHref="/work-log"
                />

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
