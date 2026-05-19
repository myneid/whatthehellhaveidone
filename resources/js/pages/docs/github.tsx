import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeftRight,
    Bot,
    Cloud,
    Download,
    FolderKanban,
    Github,
    Globe,
    Key,
    Link2,
    PlusCircle,
    RefreshCw,
    Server,
    Settings,
    Upload,
    Webhook,
} from 'lucide-react';
import { DocsCodeBlock } from '@/components/docs/docs-code-block';
import { DocsConceptCard } from '@/components/docs/docs-concept-card';
import { DocsExternalLink } from '@/components/docs/docs-external-link';
import { DocsFeatureGrid } from '@/components/docs/docs-feature-grid';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsHierarchyDiagram } from '@/components/docs/docs-hierarchy-diagram';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsSectionHeader } from '@/components/docs/docs-section-header';
import { DocsStepCard } from '@/components/docs/docs-step-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DocsLayout from '@/layouts/docs-layout';

const stats = [
    { label: 'Setup', value: '3 steps' },
    { label: 'Sync', value: '2-way' },
    { label: 'Accounts', value: 'Multi' },
];

const capabilities = [
    {
        icon: Download,
        title: 'Import issues',
        description: 'Pull open GitHub issues into your board as cards in one click.',
    },
    {
        icon: PlusCircle,
        title: 'Create from cards',
        description: 'Open a card and spin up a new GitHub issue or link an existing one.',
    },
    {
        icon: ArrowLeftRight,
        title: 'Bi-directional sync',
        description: 'Keep issue status and card position aligned across both systems.',
    },
];

const syncModes = [
    {
        icon: Webhook,
        title: 'Two-way sync',
        description:
            'Changes in GitHub reflect on the board and vice versa when webhooks are configured on the repository.',
    },
    {
        icon: Download,
        title: 'Import only',
        description:
            'Pull issues into the board without pushing card changes back to GitHub.',
    },
];

export default function DocsGitHub() {
    return (
        <>
            <Head title="GitHub Integration – Docs" />

            <div className="not-prose space-y-12">
                <DocsHero
                    eyebrow="Integrations"
                    eyebrowIcon={Github}
                    title="GitHub Integration"
                    description="Connect your GitHub account to sync issues with board cards — import open issues, create issues from cards, and keep everything in sync."
                    stats={stats}
                    actions={
                        <>
                            <Button variant="brand" asChild>
                                <Link href="/settings/integrations">Connect GitHub</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/docs/boards">Projects & Boards</Link>
                            </Button>
                        </>
                    }
                />

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Github}
                        title="What you can do"
                        description="Three ways GitHub and your boards stay connected."
                    />
                    <DocsFeatureGrid features={capabilities} columns={3} />
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Link2}
                        title="How it connects"
                        description="From your GitHub account down to individual card ↔ issue links."
                    />
                    <DocsHierarchyDiagram
                        levels={[
                            {
                                icon: Github,
                                label: 'Account',
                                description: 'OAuth connect',
                            },
                            {
                                icon: Globe,
                                label: 'Repository',
                                description: 'Linked to board',
                            },
                            {
                                icon: FolderKanban,
                                label: 'Board',
                                description: 'Kanban workspace',
                            },
                            {
                                icon: ArrowLeftRight,
                                label: 'Sync',
                                description: 'Cards ↔ issues',
                            },
                        ]}
                    />
                </section>

                <Card className="border-border bg-muted/30">
                    <CardContent className="flex gap-4 px-6 py-5">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
                            <Cloud className="size-5 text-foreground" />
                        </div>
                        <div className="space-y-1">
                            <p className="font-semibold text-foreground">
                                Using the hosted app?
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                GitHub OAuth is already configured at{' '}
                                <DocsExternalLink href="https://whatthehellhaveidone.net">
                                    whatthehellhaveidone.net
                                </DocsExternalLink>
                                . Skip the self-hosting setup below and jump straight to{' '}
                                <Link href="/settings/integrations" className="hover-docs-link">
                                    Connect your account
                                </Link>
                                .
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Server}
                        title="Self-hosting — GitHub OAuth App"
                        description="Required once per server before anyone can connect a GitHub account."
                    />

                    <DocsStepCard step={1} title="Create an OAuth App" icon={Github}>
                        <p>
                            <DocsExternalLink href="https://github.com/settings/applications/new">
                                Create a new OAuth App
                            </DocsExternalLink>{' '}
                            on GitHub, or browse from{' '}
                            <DocsExternalLink href="https://github.com/settings/developers">
                                Developer settings → OAuth Apps
                            </DocsExternalLink>
                            .
                        </p>
                        <p>
                            For the full walkthrough, see{' '}
                            <DocsExternalLink href="https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app">
                                GitHub&apos;s OAuth app guide
                            </DocsExternalLink>
                            .
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={2} title="Set the callback URL" icon={Globe}>
                        <p>
                            Set the <strong>Authorization callback URL</strong> to:
                        </p>
                        <DocsCodeBlock>
                            {`https://your-domain.com/github/callback`}
                        </DocsCodeBlock>
                    </DocsStepCard>

                    <DocsStepCard step={3} title="Copy credentials" icon={Key}>
                        <p>
                            Copy the <strong>Client ID</strong> and generate a{' '}
                            <strong>Client Secret</strong> from the OAuth app settings page.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={4} title="Add to your .env" icon={Settings}>
                        <p>Add the credentials to your environment file:</p>
                        <DocsCodeBlock>
                            {`GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URL=https://your-domain.com/github/callback`}
                        </DocsCodeBlock>
                    </DocsStepCard>

                    <DocsStepCard step={5} title="Reload config" icon={RefreshCw} isLast>
                        <p>
                            Run <code>php artisan config:clear</code> to pick up the new
                            environment variables.
                        </p>
                    </DocsStepCard>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Github}
                        title="Connect your GitHub account"
                        description="Link one or more GitHub accounts to your user profile."
                    />

                    <DocsStepCard step={1} title="Open Integrations" icon={Settings}>
                        <p>
                            Go to{' '}
                            <Link href="/settings/integrations">
                                Settings → Integrations
                            </Link>
                            .
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={2} title="Authorize on GitHub" icon={Key}>
                        <p>
                            Click <strong>Connect GitHub Account</strong> and authorize the
                            app on GitHub — you&apos;ll be redirected back automatically.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard
                        step={3}
                        title="Add more accounts if needed"
                        icon={PlusCircle}
                        isLast
                        highlights={['Multiple accounts']}
                    >
                        <p>
                            You can connect multiple GitHub accounts from the same
                            integrations page — useful if you work across personal and org
                            repos.
                        </p>
                    </DocsStepCard>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={Link2}
                        title="Link a repository to a board"
                        description="Choose which repo syncs with which board."
                    />

                    <DocsStepCard step={1} title="Open board settings" icon={Settings}>
                        <p>
                            From the <Link href="/dashboard">dashboard</Link>, open a board
                            and click <strong>Settings</strong> in the top-right corner.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={2} title="Select a repository" icon={Github}>
                        <p>
                            Under <strong>GitHub Integration</strong>, pick a repository from
                            the dropdown.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={3} title="Connect" icon={Link2} isLast>
                        <p>
                            Click <strong>Connect Repository</strong>. The board is now
                            linked and ready to import or sync issues.
                        </p>
                    </DocsStepCard>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={RefreshCw}
                        title="Working with issues"
                        description="Import existing issues or create new ones from cards."
                    />
                    <div className="grid gap-4 lg:grid-cols-2">
                        <DocsConceptCard icon={Download} title="Import GitHub issues as cards">
                            <p>
                                Once a repository is connected, click the{' '}
                                <strong>refresh icon</strong> next to the repo name in board
                                settings.
                            </p>
                            <p>
                                Open issues are imported as cards in the first list of the
                                board — ready to drag through your workflow.
                            </p>
                        </DocsConceptCard>

                        <DocsConceptCard icon={PlusCircle} title="Create a GitHub issue from a card">
                            <p>
                                Open any card and use the <strong>GitHub panel</strong> to
                                create a new issue or link to an existing one.
                            </p>
                            <p>
                                The card stays linked so status changes can sync in both
                                directions when webhooks are configured.
                            </p>
                        </DocsConceptCard>
                    </div>
                </section>

                <section className="space-y-4">
                    <DocsSectionHeader
                        icon={ArrowLeftRight}
                        title="Sync direction"
                        description="Choose how tightly GitHub and your board stay coupled."
                    />
                    <div className="grid gap-3 sm:grid-cols-2">
                        {syncModes.map((mode) => (
                            <Card
                                key={mode.title}
                                className="hover-docs-interactive border-border"
                            >
                                <CardContent className="space-y-3 px-4 py-5">
                                    <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-muted/40">
                                        <mode.icon className="size-4 text-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-semibold text-foreground">
                                            {mode.title}
                                        </p>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {mode.description}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="border-border bg-muted/20">
                        <CardContent className="flex gap-4 px-4 py-5 sm:px-6">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card">
                                <Webhook className="size-5 text-foreground" />
                            </div>
                            <div className="min-w-0 space-y-3">
                                <div className="space-y-1">
                                    <p className="font-semibold text-foreground">
                                        Webhook setup (two-way sync)
                                    </p>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        For GitHub → board updates, add a repository webhook
                                        with this payload URL:
                                    </p>
                                </div>
                                <DocsCodeBlock>
                                    {`https://your-domain.com/webhooks/github`}
                                </DocsCodeBlock>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    See{' '}
                                    <DocsExternalLink href="https://docs.github.com/en/webhooks/about-webhooks">
                                        GitHub&apos;s webhook documentation
                                    </DocsExternalLink>{' '}
                                    for event types, secrets, and delivery settings.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <Card className="border-border bg-muted/30">
                    <CardContent className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="font-semibold text-foreground">
                                Ready to connect?
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Link your GitHub account, pick a repo, and import your open
                                issues in under a minute.
                            </p>
                        </div>
                        <Button variant="brand" asChild className="shrink-0">
                            <Link href="/settings/integrations">Open integrations</Link>
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
                            title: 'Connect an AI assistant',
                            description: 'Manage cards from Claude or ChatGPT via MCP.',
                            href: '/docs/mcp-setup',
                            icon: Bot,
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

DocsGitHub.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
