import { Head, Link } from '@inertiajs/react';
import {
    Bot,
    FileText,
    FolderKanban,
    Globe,
    KanbanSquare,
    Key,
    MessageSquare,
    Monitor,
    Terminal,
    Wrench,
} from 'lucide-react';
import { DocsCodeBlock } from '@/components/docs/docs-code-block';
import { DocsCodeCallout } from '@/components/docs/docs-code-callout';
import { DocsCompactSteps } from '@/components/docs/docs-compact-steps';
import { DocsConceptCard } from '@/components/docs/docs-concept-card';
import { DocsExternalLink } from '@/components/docs/docs-external-link';
import { DocsFeatureGrid } from '@/components/docs/docs-feature-grid';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsHierarchyDiagram } from '@/components/docs/docs-hierarchy-diagram';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsPageSection } from '@/components/docs/docs-page-section';
import { Button } from '@/components/ui/button';
import DocsLayout from '@/layouts/docs-layout';

const MCP_URL = 'https://whatthehellhaveidone.net/mcp/whhid';

const stats = [
    { label: 'Setup', value: '3 steps' },
    { label: 'Transport', value: 'HTTP' },
    { label: 'Auth', value: 'Bearer' },
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
                                <Link href="/docs/mcp-tools">Available tools</Link>
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

                <DocsNextSteps
                    steps={[
                        {
                            title: 'Available Tools',
                            description: 'Full tool reference, example prompts, and security notes.',
                            href: '/docs/mcp-tools',
                            icon: Wrench,
                        },
                        {
                            title: 'Work Log',
                            description: 'Log and query work via hashtags and MCP tools.',
                            href: '/docs/work-log',
                            icon: MessageSquare,
                        },
                        {
                            title: 'Projects & Boards',
                            description: 'Learn how boards, lists, and cards work.',
                            href: '/docs/boards',
                            icon: FolderKanban,
                        },
                    ]}
                />
            </div>
        </>
    );
}

DocsMcpSetup.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
