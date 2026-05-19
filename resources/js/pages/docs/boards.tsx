import { Head, Link } from '@inertiajs/react';
import {
    Archive,
    Bot,
    Calendar,
    CheckSquare,
    Columns3,
    Eye,
    FolderKanban,
    Github,
    GripVertical,
    KanbanSquare,
    Layers,
    LayoutGrid,
    Link2,
    Lock,
    MessageSquare,
    Paperclip,
    Rocket,
    StickyNote,
    Tag,
    UserCheck,
    Users,
} from 'lucide-react';
import { DocsConceptCard } from '@/components/docs/docs-concept-card';
import { DocsCtaCard } from '@/components/docs/docs-cta-card';
import { DocsFeatureGrid } from '@/components/docs/docs-feature-grid';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsHierarchyDiagram } from '@/components/docs/docs-hierarchy-diagram';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsPageSection } from '@/components/docs/docs-page-section';
import { DocsTipList } from '@/components/docs/docs-tip-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DocsLayout from '@/layouts/docs-layout';

const stats = [
    { label: 'Levels', value: '4' },
    { label: 'Visibility', value: '3' },
    { label: 'Card fields', value: '9+' },
];

const cardFields = [
    {
        icon: StickyNote,
        title: 'Title & Description',
        description: 'Click to edit inline directly on the card detail view.',
    },
    {
        icon: LayoutGrid,
        title: 'Priority',
        description: 'None through Critical — shown as a colored left border.',
    },
    {
        icon: Calendar,
        title: 'Due date',
        description: 'Displayed on the card thumbnail when set.',
    },
    {
        icon: UserCheck,
        title: 'Assignees',
        description: 'Team members responsible for completing the work.',
    },
    {
        icon: Tag,
        title: 'Labels',
        description: 'Colored tags for categorization — multiple per card.',
    },
    {
        icon: CheckSquare,
        title: 'Checklists',
        description: 'Multi-step sub-tasks with progress tracking.',
    },
    {
        icon: MessageSquare,
        title: 'Comments',
        description: 'Discussion thread attached to the card.',
    },
    {
        icon: Paperclip,
        title: 'Attachments',
        description: 'Upload files directly to the card.',
    },
    {
        icon: Link2,
        title: 'GitHub issue link',
        description: 'Connect to a GitHub issue for two-way sync.',
    },
];

const visibilityOptions = [
    {
        icon: Lock,
        title: 'Private',
        description: 'Only you can see and edit the board.',
    },
    {
        icon: Users,
        title: 'Team',
        description: 'Visible to all project members. This is the default.',
    },
    {
        icon: Eye,
        title: 'Public',
        description: 'Anyone with the URL can view — but not edit.',
    },
];

export default function DocsBoards() {
    return (
        <>
            <Head title="Projects & Boards – Docs" />

            <div className="not-prose space-y-12">
                <DocsHero
                    eyebrow="Core Concepts"
                    eyebrowIcon={FolderKanban}
                    title="Projects & Boards"
                    description="Understand how projects, boards, lists, and cards fit together — plus visibility, labels, and everything inside a card."
                    stats={stats}
                    actions={
                        <>
                            <Button variant="brand" asChild>
                                <Link href="/dashboard">Open dashboard</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/docs/getting-started">Getting started</Link>
                            </Button>
                        </>
                    }
                />

                <DocsPageSection
                        icon={Layers}
                        title="How it fits together"
                        description="Four nested levels — from team container down to individual tasks."
                >
                    <DocsHierarchyDiagram
                        levels={[
                            {
                                icon: FolderKanban,
                                label: 'Project',
                                description: 'Team & boards',
                            },
                            {
                                icon: KanbanSquare,
                                label: 'Board',
                                description: 'Kanban workspace',
                            },
                            {
                                icon: Columns3,
                                label: 'List',
                                description: 'Column / stage',
                            },
                            {
                                icon: StickyNote,
                                label: 'Card',
                                description: 'Single task',
                            },
                        ]}
                    />
                </DocsPageSection>

                <DocsPageSection
                    icon={FolderKanban}
                    title="Projects & boards"
                    description="The two containers that organize your work."
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        <DocsConceptCard icon={FolderKanban} title="Projects">
                            <p>
                                A <strong>project</strong> is the top-level container. It groups
                                related boards together and defines a team of members who can
                                access everything inside it.
                            </p>
                            <ul className="list-inside list-disc space-y-1.5">
                                <li>
                                    Create a project from the dashboard with{' '}
                                    <strong>New Project</strong>.
                                </li>
                                <li>
                                    Invite team members from the project&apos;s{' '}
                                    <strong>Members</strong> tab.
                                </li>
                                <li>Archive a project to hide it without deleting it.</li>
                            </ul>
                        </DocsConceptCard>

                        <DocsConceptCard
                            icon={KanbanSquare}
                            title="Boards"
                            highlights={['Lists', 'Cards', 'Drag & drop']}
                        >
                            <p>
                                A <strong>board</strong> is a Kanban board. It lives inside a
                                project or stands alone. Each board has lists (columns) that
                                contain cards (tasks).
                            </p>
                            <p>
                                Pick a visibility level and optional background color when you
                                create a board from <strong>New Board</strong>.
                            </p>
                        </DocsConceptCard>
                    </div>
                </DocsPageSection>

                <DocsPageSection
                    icon={Eye}
                    title="Board visibility"
                    description="Control who can see each board."
                >
                    <div className="grid gap-3 sm:grid-cols-3">
                        {visibilityOptions.map((option) => (
                            <Card
                                key={option.title}
                                className="hover-docs-interactive border-border"
                            >
                                <CardContent className="space-y-3 px-4 py-5">
                                    <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/40">
                                        <option.icon className="size-4 text-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground">
                                            {option.title}
                                        </p>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {option.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </DocsPageSection>

                <DocsPageSection
                    icon={Columns3}
                    title="Lists & cards"
                    description="Columns hold your tasks — drag cards between them to update status."
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        <DocsConceptCard icon={Columns3} title="Lists">
                            <p>
                                Lists are the columns of your board. Add them with{' '}
                                <strong>+ Add list</strong> at the right edge of the board.
                            </p>
                            <p>
                                Drag a card from one list to another to move it through your
                                workflow — To Do, In Progress, Done, or whatever fits your team.
                            </p>
                        </DocsConceptCard>

                        <DocsConceptCard icon={StickyNote} title="Cards">
                            <p>
                                Cards are individual tasks. Click a card to open its detail view
                                where you can edit every field, comment, and attachment.
                            </p>
                            <p>
                                Cards show a compact thumbnail on the board with priority border,
                                due date, assignee avatars, and label dots.
                            </p>
                        </DocsConceptCard>
                    </div>
                </DocsPageSection>

                <DocsPageSection
                    icon={LayoutGrid}
                    title="Everything on a card"
                    description="Nine fields to track work from idea to done."
                >
                    <DocsFeatureGrid features={cardFields} columns={3} />
                </DocsPageSection>

                <DocsPageSection
                    icon={Tag}
                    title="Labels & archiving"
                    description="Organize with tags and clean up without losing data."
                >
                    <div className="grid gap-4 lg:grid-cols-2">
                        <DocsConceptCard icon={Tag} title="Labels">
                            <p>
                                Labels are board-scoped. Create them in the board settings sheet.
                                Assign multiple labels to a card — they show as colored dots on
                                the card thumbnail.
                            </p>
                        </DocsConceptCard>

                        <DocsConceptCard icon={Archive} title="Archiving">
                            <p>
                                Archive a card from its detail view to hide it without deleting.
                                Archived cards can be restored at any time.
                            </p>
                            <p>
                                Archiving a board removes it from the active list but preserves
                                all data — cards, lists, and history stay intact.
                            </p>
                        </DocsConceptCard>
                    </div>
                </DocsPageSection>

                <DocsPageSection
                    icon={GripVertical}
                    title="Keyboard & drag tips"
                    description="Small shortcuts that speed up everyday board work."
                >
                    <DocsTipList
                        tips={[
                            {
                                title: 'Cancel adding a card',
                                description: (
                                    <>
                                        Press <kbd>Escape</kbd> while the add-card input is open.
                                    </>
                                ),
                            },
                            {
                                title: 'Move cards between lists',
                                description:
                                    'Drag cards by the grip handle that appears when you hover over a card.',
                            },
                            {
                                title: 'Quick navigation',
                                description: (
                                    <>
                                        Use <kbd>Escape</kbd> to close the card detail panel and
                                        return to the board.
                                    </>
                                ),
                            },
                        ]}
                    />
                </DocsPageSection>

                <DocsCtaCard
                    title="Ready to build your first board?"
                    description="Head to the dashboard and create a project — or jump straight to a standalone board."
                    actionLabel="Go to dashboard"
                    actionHref="/dashboard"
                />

                <DocsNextSteps
                    steps={[
                        {
                            title: 'GitHub integration',
                            description: 'Sync issues with board cards both ways.',
                            href: '/docs/github',
                            icon: Github,
                        },
                        {
                            title: 'Connect an AI assistant',
                            description: 'Let Claude or ChatGPT manage cards via MCP.',
                            href: '/docs/mcp-setup',
                            icon: Bot,
                        },
                        {
                            title: 'Getting started',
                            description: 'Five steps from account to first board.',
                            href: '/docs/getting-started',
                            icon: Rocket,
                        },
                    ]}
                />
            </div>
        </>
    );
}

DocsBoards.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
