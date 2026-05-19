import { Head, Link } from '@inertiajs/react';
import {
    BookOpen,
    Bot,
    FileText,
    FolderKanban,
    Github,
    Globe,
    Key,
    KanbanSquare,
    Lock,
    MessageSquare,
    Monitor,
    Shield,
    Terminal,
    Upload,
    Wrench,
} from 'lucide-react';
import { DocsCodeBlock } from '@/components/docs/docs-code-block';
import { DocsCodeCallout } from '@/components/docs/docs-code-callout';
import { DocsCompactSteps } from '@/components/docs/docs-compact-steps';
import { DocsConceptCard } from '@/components/docs/docs-concept-card';
import { DocsCtaCard } from '@/components/docs/docs-cta-card';
import { DocsExternalLink } from '@/components/docs/docs-external-link';
import { DocsFeatureGrid } from '@/components/docs/docs-feature-grid';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsHierarchyDiagram } from '@/components/docs/docs-hierarchy-diagram';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsPageSection } from '@/components/docs/docs-page-section';
import { DocsTipList } from '@/components/docs/docs-tip-list';
import { DocsToolsTable } from '@/components/docs/docs-tools-table';
import { Button } from '@/components/ui/button';
import DocsLayout from '@/layouts/docs-layout';

const MCP_URL = 'https://whatthehellhaveidone.net/mcp/whhid';

const stats = [
    { label: 'Setup', value: '3 steps' },
    { label: 'Tools', value: '11' },
    { label: 'Transport', value: 'HTTP' },
];

const capabilities = [
    {
        icon: FolderKanban,
        title: 'Projects & boards',
        description: 'List projects, read boards with lists and cards, filter by list or priority.',
    },
    {
        icon: KanbanSquare,
        title: 'Cards',
        description: 'Create, move, and inspect cards — including comments and checklists.',
    },
    {
        icon: MessageSquare,
        title: 'Work log',
        description: 'Log time with hashtags, query daily entries, and update existing logs.',
    },
    {
        icon: FileText,
        title: 'Documents',
        description: 'List and read project documents so your assistant has full context.',
    },
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

const claudeDesktopConfig = `{
  "mcpServers": {
    "whatthehellhaveidone": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "${MCP_URL}",
        "--header",
        "Authorization:Bearer YOUR_TOKEN_HERE"
      ]
    }
  }
}`;

const claudeCodeConfig = `claude mcp add whatthehellhaveidone \\
  --transport http \\
  --url ${MCP_URL} \\
  --header "Authorization: Bearer YOUR_TOKEN_HERE"`;

export default function DocsMcpSetup() {
    return (
        <>
            <Head title="MCP Setup – Docs">
                <meta
                    name="description"
                    content="Connect Claude, ChatGPT, or any MCP-compatible AI assistant to your boards, cards, and work log via the built-in MCP server."
                />
            </Head>

            <div className="not-prose space-y-12">
                <DocsHero
                    eyebrow="AI Integration"
                    eyebrowIcon={Bot}
                    title="MCP Setup"
                    description="Connect Claude, ChatGPT, Cursor, or any MCP-compatible assistant to your boards, cards, work log, and documents — no copy-pasting required."
                    stats={stats}
                    actions={
                        <>
                            <Button variant="brand" asChild>
                                <Link href="/mcp-tokens">Create MCP token</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/docs/work-log">Work Log</Link>
                            </Button>
                        </>
                    }
                />

                <DocsPageSection
                    icon={Bot}
                    title="What your assistant can do"
                    description={
                        <>
                            Powered by the{' '}
                            <DocsExternalLink href="https://modelcontextprotocol.io">
                                Model Context Protocol
                            </DocsExternalLink>
                            .
                        </>
                    }
                >
                    <DocsFeatureGrid features={capabilities} columns={2} />
                </DocsPageSection>

                <DocsPageSection
                    icon={Globe}
                    title="How it connects"
                    description="A bearer token authenticates your AI client to the MCP server."
                >
                    <DocsHierarchyDiagram
                        levels={[
                            {
                                icon: Key,
                                label: 'Token',
                                description: 'Bearer auth',
                            },
                            {
                                icon: Globe,
                                label: 'MCP server',
                                description: '/mcp/whhid',
                            },
                            {
                                icon: Monitor,
                                label: 'AI client',
                                description: 'Claude, Cursor…',
                            },
                            {
                                icon: KanbanSquare,
                                label: 'Your data',
                                description: 'Boards & logs',
                            },
                        ]}
                    />
                </DocsPageSection>

                <DocsPageSection
                    icon={Wrench}
                    title="Quick start"
                    description="Three steps to connect any MCP-compatible client."
                >
                    <DocsCompactSteps
                        steps={[
                            {
                                title: 'Create an MCP token',
                                description: (
                                    <>
                                        Go to{' '}
                                        <Link href="/mcp-tokens" className="hover-docs-link">
                                            Settings → MCP Tokens
                                        </Link>{' '}
                                        and click <strong>Create</strong>. Copy the token
                                        immediately — it is shown only once.
                                    </>
                                ),
                            },
                            {
                                title: 'Note the server URL',
                                description: (
                                    <>
                                        The endpoint is{' '}
                                        <code>{MCP_URL}</code> (replace the domain if
                                        self-hosting).
                                    </>
                                ),
                            },
                            {
                                title: 'Configure your AI client',
                                description:
                                    'Paste the URL and token into Claude Desktop, Claude Code, Cursor, or any HTTP MCP client — see below.',
                            },
                        ]}
                    />
                </DocsPageSection>

                <DocsPageSection icon={Globe} title="MCP server URL">
                    <DocsCodeCallout code={MCP_URL}>
                        Use <strong>Streamable HTTP</strong> transport. Send your token as{' '}
                        <code>Authorization: Bearer YOUR_TOKEN_HERE</code>. On self-hosted
                        installs, swap <code>whatthehellhaveidone.net</code> for your domain.
                    </DocsCodeCallout>
                </DocsPageSection>

                <DocsPageSection
                    icon={Terminal}
                    title="Configure your client"
                    description="Pick your assistant — each needs the same URL and bearer token."
                >
                    <div className="space-y-4">
                        <DocsConceptCard icon={Monitor} title="Claude Desktop">
                            <p>
                                Edit{' '}
                                <code>
                                    ~/Library/Application Support/Claude/claude_desktop_config.json
                                </code>{' '}
                                on macOS (path varies on Windows/Linux).
                            </p>
                            <DocsCodeBlock>{claudeDesktopConfig}</DocsCodeBlock>
                            <p>
                                Restart Claude Desktop — you should see{' '}
                                <strong>whatthehellhaveidone</strong> in the tools list.
                            </p>
                        </DocsConceptCard>

                        <DocsConceptCard icon={Terminal} title="Claude Code (CLI)">
                            <p>Add the server via the CLI:</p>
                            <DocsCodeBlock>{claudeCodeConfig}</DocsCodeBlock>
                        </DocsConceptCard>

                        <DocsConceptCard icon={Bot} title="ChatGPT / OpenAI">
                            <p>
                                In a GPT&apos;s configuration or via the Assistants API, point at
                                the MCP endpoint with an{' '}
                                <code>Authorization: Bearer YOUR_TOKEN_HERE</code> header.
                            </p>
                            <p>
                                Full MCP support in ChatGPT depends on OpenAI&apos;s current
                                plugin interface — check their docs for the latest status.
                            </p>
                        </DocsConceptCard>

                        <DocsConceptCard icon={Wrench} title="Cursor & other MCP clients">
                            <p>Any HTTP MCP client can connect with:</p>
                            <ul className="list-inside list-disc space-y-1.5">
                                <li>
                                    <strong>URL:</strong> <code>{MCP_URL}</code>
                                </li>
                                <li>
                                    <strong>Transport:</strong> HTTP (Streamable HTTP)
                                </li>
                                <li>
                                    <strong>Auth:</strong> Bearer token in{' '}
                                    <code>Authorization</code> header
                                </li>
                            </ul>
                        </DocsConceptCard>
                    </div>
                </DocsPageSection>

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

DocsMcpSetup.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
