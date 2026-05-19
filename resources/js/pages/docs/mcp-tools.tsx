import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Bot,
    FolderKanban,
    Github,
    Lock,
    MessageSquare,
    Shield,
    Wrench,
} from 'lucide-react';
import { DocsConceptCard } from '@/components/docs/docs-concept-card';
import { DocsCtaCard } from '@/components/docs/docs-cta-card';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsPageSection } from '@/components/docs/docs-page-section';
import { DocsTipList } from '@/components/docs/docs-tip-list';
import { DocsToolsTable } from '@/components/docs/docs-tools-table';
import { Button } from '@/components/ui/button';
import DocsLayout from '@/layouts/docs-layout';

const stats = [
    { label: 'Tools', value: '11' },
    { label: 'Transport', value: 'HTTP' },
    { label: 'Auth', value: 'Bearer' },
];

const mcpTools = [
    { name: 'list_projects', description: 'List all your projects' },
    { name: 'get_board', description: 'Get a board with its lists and cards' },
    { name: 'list_cards', description: 'List cards in a board (filterable by list, priority)' },
    { name: 'get_card', description: 'Get full card details including comments and checklists' },
    { name: 'create_card', description: 'Create a new card in a list' },
    { name: 'move_card', description: 'Move a card to a different list' },
    { name: 'create_work_log_entry', description: 'Log work with hashtag-based project tagging' },
    { name: 'update_work_log_entry', description: 'Edit an existing work log entry' },
    { name: 'get_daily_work_log', description: "Retrieve today's (or any date's) work log" },
    { name: 'list_documents', description: 'List documents in a project' },
    { name: 'get_document', description: "Read a project document's full content" },
];

const examplePrompts = [
    {
        title: 'Review a board',
        description: '&ldquo;Show me all open cards in the API board&rdquo;',
    },
    {
        title: 'Create a card',
        description:
            '&ldquo;Create a card titled Fix login bug in the To Do list on my main board&rdquo;',
    },
    {
        title: 'Log work',
        description:
            '&ldquo;Log that I spent 2 hours fixing the auth issue #backend&rdquo;',
    },
    {
        title: 'Daily recap',
        description: '&ldquo;What did I work on today?&rdquo;',
    },
];

export default function DocsMcpTools() {
    return (
        <>
            <Head title="MCP Tools – Docs">
                <meta
                    name="description"
                    content="Reference for all eleven WHHID MCP tools — boards, cards, work log, and documents — plus example prompts and security notes."
                />
            </Head>

            <div className="not-prose space-y-12">
                <DocsHero
                    eyebrow="AI Integration"
                    eyebrowIcon={Bot}
                    title="Available Tools"
                    description="Eleven tools registered on the WHHID MCP server — manage boards, log work, and read project documents from any connected assistant."
                    stats={stats}
                    actions={
                        <>
                            <Button variant="brand" asChild>
                                <Link href="/mcp-tokens">Create MCP token</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/docs/mcp-setup">MCP Setup</Link>
                            </Button>
                        </>
                    }
                />

                <DocsPageSection
                    icon={Wrench}
                    title="Available tools"
                    description="Eleven tools registered on the WHHID MCP server."
                >
                    <DocsToolsTable tools={mcpTools} />
                </DocsPageSection>

                <DocsPageSection
                    icon={MessageSquare}
                    title="Example prompts"
                    description="Once connected, try asking:"
                >
                    <DocsTipList tips={examplePrompts} />
                </DocsPageSection>

                <DocsPageSection icon={Shield} title="Security">
                    <DocsConceptCard icon={Lock} title="Treat tokens like passwords">
                        <p>
                            Each token grants full access to your account&apos;s data. If a token
                            is compromised, revoke it immediately from{' '}
                            <Link href="/mcp-tokens" className="hover-docs-link">
                                Settings → MCP Tokens
                            </Link>
                            .
                        </p>
                        <p>
                            Tokens do not expire automatically — revoke them manually when no
                            longer needed.
                        </p>
                    </DocsConceptCard>
                </DocsPageSection>

                <DocsCtaCard
                    title="Ready to connect?"
                    description="Create a token, drop it into your AI client, and start managing boards from the chat."
                    actionLabel="Create MCP token"
                    actionHref="/mcp-tokens"
                />

                <DocsNextSteps
                    steps={[
                        {
                            title: 'MCP Setup',
                            description: 'Connect Claude, Cursor, or ChatGPT to the server.',
                            href: '/docs/mcp-setup',
                            icon: Bot,
                        },
                        {
                            title: 'Work Log',
                            description: 'Log and query work via hashtags and MCP tools.',
                            href: '/docs/work-log',
                            icon: BookOpen,
                        },
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
                    ]}
                />
            </div>
        </>
    );
}

DocsMcpTools.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
