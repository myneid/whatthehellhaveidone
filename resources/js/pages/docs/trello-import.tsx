import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    Archive,
    Bot,
    CheckSquare,
    Clock,
    Columns3,
    Download,
    FileJson,
    FolderKanban,
    Github,
    History,
    LayoutGrid,
    Loader2,
    MessageSquare,
    Paperclip,
    Settings,
    StickyNote,
    Tag,
    Upload,
    UserX,
} from 'lucide-react';
import { DocsCodeBlock } from '@/components/docs/docs-code-block';
import { DocsExternalLink } from '@/components/docs/docs-external-link';
import { DocsFeatureGrid } from '@/components/docs/docs-feature-grid';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsHierarchyDiagram } from '@/components/docs/docs-hierarchy-diagram';
import { DocsIncludedExcluded } from '@/components/docs/docs-included-excluded';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsSectionHeader } from '@/components/docs/docs-section-header';
import { DocsStepCard } from '@/components/docs/docs-step-card';
import { DocsTipList } from '@/components/docs/docs-tip-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DocsLayout from '@/layouts/docs-layout';

const stats = [
    { label: 'Phases', value: '2' },
    { label: 'Data', value: '4 types' },
    { label: 'Max file', value: '10 MB' },
];

const importedHighlights = [
    {
        icon: Columns3,
        title: 'Lists',
        description: 'All open lists imported in order — archived lists are skipped.',
    },
    {
        icon: StickyNote,
        title: 'Cards',
        description: 'Open cards with title, description, due date, and position.',
    },
    {
        icon: Tag,
        title: 'Labels',
        description: 'Trello label colors mapped to matching hex colors.',
    },
    {
        icon: CheckSquare,
        title: 'Checklists',
        description: 'Checklist items with completion state preserved.',
    },
];

const included = [
    {
        icon: Columns3,
        title: 'Lists',
        description: 'All non-archived lists, preserving order.',
    },
    {
        icon: StickyNote,
        title: 'Cards',
        description: 'Open cards with title, description, due date, and position.',
    },
    {
        icon: Tag,
        title: 'Labels',
        description: 'Trello label colors mapped to hex colors on your board.',
    },
    {
        icon: CheckSquare,
        title: 'Checklists',
        description: 'All checklist items with completion state.',
    },
];

const excluded = [
    {
        icon: Archive,
        title: 'Archived lists and cards',
        description: 'Closed items in Trello are not brought over.',
    },
    {
        icon: Paperclip,
        title: 'Attachments',
        description: 'File contents are not transferred — re-upload manually.',
    },
    {
        icon: UserX,
        title: 'Member assignments',
        description: 'Trello members must be matched to users manually.',
    },
    {
        icon: MessageSquare,
        title: 'Comments',
        description: 'Card discussion threads are not imported.',
    },
    {
        icon: History,
        title: 'Activity history',
        description: 'Card move/change log from Trello is not preserved.',
    },
];

export default function DocsTrelloImport() {
    return (
        <>
            <Head title="Trello Import – Docs" />

            <div className="not-prose space-y-12">
                <DocsHero
                    eyebrow="Migration"
                    eyebrowIcon={LayoutGrid}
                    title="Import from Trello"
                    description="Migrate your existing Trello boards in a few clicks — lists, cards, labels, checklists, and due dates come over automatically."
                    stats={stats}
                    actions={
                        <>
                            <Button variant="brand" asChild>
                                <Link href="/dashboard">Open a board</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/docs/boards">Projects & Boards</Link>
                            </Button>
                        </>
                    }
                />

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Download}
                        title="What comes over"
                        description="Four data types transfer from your Trello JSON export."
                    />
                    <DocsFeatureGrid features={importedHighlights} columns={2} />
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Upload}
                        title="How it works"
                        description="Export from Trello, upload to a board, and let the queue do the rest."
                    />
                    <DocsHierarchyDiagram
                        levels={[
                            {
                                icon: Download,
                                label: 'Trello',
                                description: 'Export JSON',
                            },
                            {
                                icon: FileJson,
                                label: 'Upload',
                                description: 'Board settings',
                            },
                            {
                                icon: Loader2,
                                label: 'Queue',
                                description: 'Background job',
                            },
                            {
                                icon: FolderKanban,
                                label: 'Board',
                                description: 'Cards ready',
                            },
                        ]}
                    />
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Download}
                        title="Export from Trello"
                        description="Download a JSON snapshot of your board first."
                    />

                    <DocsStepCard step={1} title="Open your Trello board" icon={LayoutGrid}>
                        <p>
                            In Trello, open the board you want to migrate. You need board
                            access to export its data.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={2} title="Open the export menu" icon={Settings}>
                        <p>
                            Click <strong>Show Menu</strong> → <strong>More</strong> →{' '}
                            <strong>Print and Export</strong>.
                        </p>
                        <p>
                            See{' '}
                            <DocsExternalLink href="https://support.atlassian.com/trello/docs/exporting-data-from-trello/">
                                Atlassian&apos;s export guide
                            </DocsExternalLink>{' '}
                            for screenshots and account requirements.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={3} title="Save the JSON file" icon={FileJson} isLast>
                        <p>
                            Choose <strong>Export as JSON</strong> and save the{' '}
                            <code>.json</code> file to your computer. Keep it under{' '}
                            <strong>10 MB</strong>.
                        </p>
                    </DocsStepCard>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Upload}
                        title="Import into a board"
                        description="Upload the export from any board you manage."
                    />

                    <DocsStepCard step={1} title="Open or create a board" icon={FolderKanban}>
                        <p>
                            From the <Link href="/dashboard">dashboard</Link>, open an
                            existing{' '}
                            <Link href="/docs/boards" className="hover-docs-link">
                                board
                            </Link>{' '}
                            or create a new one for the import.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={2} title="Open board settings" icon={Settings}>
                        <p>
                            Click <strong>Settings</strong> in the board header, then scroll
                            to <strong>Import from Trello</strong>.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={3} title="Select your JSON file" icon={FileJson}>
                        <p>
                            Click the upload area and choose your exported{' '}
                            <code>.json</code> file.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={4} title="Start the import" icon={Upload}>
                        <p>
                            Click <strong>Import Board</strong>. The file is validated and
                            queued for processing.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={5} title="Watch the status page" icon={Clock} isLast>
                        <p>
                            You&apos;ll land on a status page that auto-refreshes every few
                            seconds until the import completes or fails. When done, a summary
                            shows how many lists, labels, and cards were imported.
                        </p>
                    </DocsStepCard>
                </section>

                <Card className="border-border bg-muted/30">
                    <CardContent className="flex gap-4 px-6 py-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-[#0079BF]">
                            <Loader2 className="size-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">
                                Runs in the background
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Imports are processed asynchronously via the queue — you can
                                close the tab and come back. On self-hosted installs, make
                                sure a queue worker is running (see Troubleshooting below).
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={CheckSquare}
                        title="Import coverage"
                        description="Know exactly what transfers and what stays behind."
                    />
                    <DocsIncludedExcluded included={included} excluded={excluded} />
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={AlertTriangle}
                        title="Troubleshooting"
                        description="Common issues and how to fix them."
                    />
                    <DocsTipList
                        tips={[
                            {
                                title: 'Invalid export file',
                                description: (
                                    <>
                                        The JSON must be a valid Trello board export with a{' '}
                                        <code>name</code> field at the root. Re-export from
                                        Trello if the file was edited or corrupted.
                                    </>
                                ),
                            },
                            {
                                title: 'File too large',
                                description:
                                    'Exports must be under 10 MB. Archive old cards in Trello or split work across multiple boards before exporting.',
                            },
                            {
                                title: 'Import stuck on "Queued"',
                                description: (
                                    <>
                                        Self-hosted installs need a queue worker running:{' '}
                                        <code>php artisan queue:work</code>. Without it, the
                                        import will never process.
                                    </>
                                ),
                            },
                            {
                                title: 'Cards skipped with warnings',
                                description:
                                    'Cards whose lists were archived in Trello are skipped. Check the status page for a warnings list after import.',
                            },
                        ]}
                    />
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Settings}
                        title="Self-hosting — queue worker"
                        description="Required for Trello imports (and other background jobs) on your own server."
                    />
                    <DocsCodeBlock>{`php artisan queue:work`}</DocsCodeBlock>
                    <p className="text-sm text-muted-foreground">
                        Run this in a terminal or process manager (Supervisor, systemd, Laravel
                        Horizon) so imports process after upload.
                    </p>
                </section>

                <Card className="border-border bg-muted/30">
                    <CardContent className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-semibold text-foreground">
                                Ready to migrate?
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Export JSON from Trello, then upload it from any{' '}
                                <Link href="/docs/boards" className="hover-docs-link">
                                    board&apos;s settings
                                </Link>
                                .
                            </p>
                        </div>
                        <Button variant="brand" asChild className="shrink-0">
                            <Link href="/dashboard">Go to dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>

                <DocsNextSteps
                    steps={[
                        {
                            title: 'Projects & Boards',
                            description: 'Learn how boards, lists, and cards work.',
                            href: '/docs/boards',
                            icon: FolderKanban,
                        },
                        {
                            title: 'GitHub integration',
                            description: 'Sync issues with board cards both ways.',
                            href: '/docs/github',
                            icon: Github,
                        },
                        {
                            title: 'Connect an AI assistant',
                            description: 'Manage cards from Claude or ChatGPT via MCP.',
                            href: '/docs/mcp-setup',
                            icon: Bot,
                        },
                    ]}
                />
            </div>
        </>
    );
}

DocsTrelloImport.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
