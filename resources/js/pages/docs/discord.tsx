import { Head, Link } from '@inertiajs/react';
import {
    ArrowRightLeft,
    Bell,
    Bot,
    FolderKanban,
    Github,
    Hash,
    MessageSquare,
    MessageSquarePlus,
    Paperclip,
    PlusCircle,
    Send,
    Settings,
    Trash2,
    Webhook,
} from 'lucide-react';
import { DocsConceptCard } from '@/components/docs/docs-concept-card';
import { DocsExternalLink } from '@/components/docs/docs-external-link';
import { DocsFeatureGrid } from '@/components/docs/docs-feature-grid';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsHierarchyDiagram } from '@/components/docs/docs-hierarchy-diagram';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsSectionHeader } from '@/components/docs/docs-section-header';
import { DocsStepCard } from '@/components/docs/docs-step-card';
import { DiscordIcon } from '@/components/icons/discord-icon';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DocsLayout from '@/layouts/docs-layout';

const stats = [
    { label: 'Setup', value: '3 steps' },
    { label: 'Events', value: '4+' },
    { label: 'Scope', value: 'Per board' },
];

const notifications = [
    {
        icon: PlusCircle,
        title: 'Card created',
        description: 'New tasks land in a list — your channel hears about it instantly.',
    },
    {
        icon: ArrowRightLeft,
        title: 'Card moved',
        description: 'Drag a card between lists and Discord gets a status update.',
    },
    {
        icon: MessageSquarePlus,
        title: 'New comment',
        description: 'Discussion on a card posts to the channel with a link back.',
    },
    {
        icon: Paperclip,
        title: 'Attachment added',
        description: 'Files uploaded to a card trigger a notification.',
    },
];

const defaultEvents = [
    { icon: PlusCircle, label: 'Card created', code: 'card.created' },
    { icon: ArrowRightLeft, label: 'Card moved', code: 'card.moved' },
    { icon: MessageSquare, label: 'Comment added', code: 'card.commented' },
    { icon: Paperclip, label: 'Attachment added', code: 'card.attachment_added' },
];

export default function DocsDiscord() {
    return (
        <>
            <Head title="Discord Notifications – Docs" />

            <div className="not-prose space-y-12">
                <DocsHero
                    eyebrow="Integrations"
                    eyebrowIcon={DiscordIcon}
                    title="Discord Notifications"
                    description="Get notified in a Discord channel whenever cards are created, moved, commented on, or receive attachments — one webhook per board."
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
                        icon={Bell}
                        title="What gets notified"
                        description="Rich embed messages from WHHID bot — with board name, list, and a link to the card."
                    />
                    <DocsFeatureGrid features={notifications} columns={2} />
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Webhook}
                        title="How it connects"
                        description="Each board gets its own webhook pointing at a Discord channel."
                    />
                    <DocsHierarchyDiagram
                        levels={[
                            {
                                icon: FolderKanban,
                                label: 'Board',
                                description: 'Your Kanban',
                            },
                            {
                                icon: Webhook,
                                label: 'Webhook',
                                description: 'Encrypted URL',
                            },
                            {
                                icon: Hash,
                                label: 'Channel',
                                description: '#dev-updates',
                            },
                            {
                                icon: Bell,
                                label: 'Alerts',
                                description: 'WHHID bot',
                            },
                        ]}
                    />
                </section>

                <Card className="border-border bg-muted/30">
                    <CardContent className="flex gap-4 px-6 py-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-[#5865F2]">
                            <DiscordIcon className="size-5" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">
                                One webhook per board
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                Point different boards at different channels — e.g.{' '}
                                <strong>#dev-updates</strong> for engineering and{' '}
                                <strong>#design</strong> for creative work. Webhook URLs are
                                stored encrypted and never shown in the UI after saving.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={DiscordIcon}
                        title="Create a Discord webhook"
                        description="Set this up once in Discord — takes about a minute."
                    />

                    <DocsStepCard step={1} title="Open channel settings" icon={Hash}>
                        <p>
                            In Discord, right-click the channel you want to notify and choose{' '}
                            <strong>Edit Channel</strong>.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={2} title="Create the webhook" icon={Webhook}>
                        <p>
                            Go to <strong>Integrations → Webhooks → New Webhook</strong>. Give
                            it a name that matches the channel (e.g.{' '}
                            <code>#dev-updates</code>).
                        </p>
                        <p>
                            See{' '}
                            <DocsExternalLink href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks">
                                Discord&apos;s webhook guide
                            </DocsExternalLink>{' '}
                            for screenshots and setup steps, or the{' '}
                            <DocsExternalLink href="https://discord.com/developers/docs/resources/webhook">
                                webhook API reference
                            </DocsExternalLink>{' '}
                            for technical details.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={3} title="Copy the webhook URL" icon={Settings} isLast>
                        <p>
                            Copy the full <strong>Webhook URL</strong> — it looks like{' '}
                            <code>https://discord.com/api/webhooks/…</code>. You&apos;ll paste
                            this into{' '}
                            <Link href="/docs/boards" className="hover-docs-link">
                                board settings
                            </Link>{' '}
                            next.
                        </p>
                    </DocsStepCard>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Settings}
                        title="Add the webhook to a board"
                        description="Connect Discord from any board you manage."
                    />

                    <DocsStepCard step={1} title="Open board settings" icon={Settings}>
                        <p>
                            From the <Link href="/dashboard">dashboard</Link>, open a{' '}
                            <Link href="/docs/boards" className="hover-docs-link">
                                board
                            </Link>{' '}
                            and click <strong>Settings</strong> in the top-right corner.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={2} title="Enter webhook details" icon={Webhook}>
                        <p>
                            Scroll to <strong>Discord Webhook</strong>. Enter a display name
                            (e.g. <code>#dev-updates</code>) and paste the webhook URL.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={3} title="Save" icon={Send} isLast>
                        <p>
                            Click <strong>Save Webhook</strong>. The URL is encrypted and
                            stored securely — you won&apos;t see it again after saving.
                        </p>
                    </DocsStepCard>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Send}
                        title="Test & manage"
                        description="Confirm delivery, then tweak or remove as needed."
                    />
                    <div className="grid gap-4 lg:grid-cols-2">
                        <DocsConceptCard icon={Send} title="Test the webhook">
                            <p>
                                After saving, click <strong>Test</strong> in{' '}
                                <Link href="/docs/boards" className="hover-docs-link">
                                    board settings
                                </Link>
                                . WHHID bot sends a confirmation message to your channel so you
                                know everything is wired up.
                            </p>
                        </DocsConceptCard>

                        <DocsConceptCard icon={Trash2} title="Update or remove">
                            <p>
                                Re-open{' '}
                                <Link href="/docs/boards" className="hover-docs-link">
                                    board settings
                                </Link>{' '}
                                to change the display name or paste a new URL. Click the trash
                                icon to remove the webhook entirely.
                            </p>
                            <p>
                                Leave the URL field blank when updating to keep the existing
                                webhook URL unchanged.
                            </p>
                        </DocsConceptCard>
                    </div>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Bell}
                        title="Notification events"
                    />
                    <p className="text-sm text-muted-foreground">
                        These events are enabled by default — customize them in{' '}
                        <Link href="/docs/boards" className="hover-docs-link">
                            board settings
                        </Link>
                        .
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {defaultEvents.map((event) => (
                            <Card
                                key={event.code}
                                className="hover-docs-interactive border-border bg-card/80"
                            >
                                <CardContent className="flex flex-col gap-3 px-4 py-4">
                                    <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/40">
                                        <event.icon className="size-4 text-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-foreground">
                                            {event.label}
                                        </p>
                                        <p className="font-mono text-xs text-muted-foreground">
                                            {event.code}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Additional events can be configured in{' '}
                        <Link href="/docs/boards" className="hover-docs-link">
                            board settings
                        </Link>{' '}
                        as they become available.
                    </p>
                </section>

                <Card className="border-border bg-muted/30">
                    <CardContent className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-semibold text-foreground">
                                Ready to wire up Discord?
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Create a webhook in Discord, then paste it into any{' '}
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
                            title: 'GitHub integration',
                            description: 'Sync issues with board cards both ways.',
                            href: '/docs/github',
                            icon: Github,
                        },
                        {
                            title: 'Projects & Boards',
                            description: 'Learn how boards, lists, and cards work.',
                            href: '/docs/boards',
                            icon: FolderKanban,
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

DocsDiscord.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
