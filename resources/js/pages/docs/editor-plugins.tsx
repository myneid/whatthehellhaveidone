import { Head, Link } from '@inertiajs/react';
import { Bot, Code2, Download, FolderKanban, MessageSquare, Plug, Terminal } from 'lucide-react';
import { DocsCodeBlock } from '@/components/docs/docs-code-block';
import { DocsConceptCard } from '@/components/docs/docs-concept-card';
import { DocsCtaCard } from '@/components/docs/docs-cta-card';
import { DocsExternalLink } from '@/components/docs/docs-external-link';
import { DocsFeatureGrid } from '@/components/docs/docs-feature-grid';
import { DocsHero } from '@/components/docs/docs-hero';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsPageSection } from '@/components/docs/docs-page-section';
import { Button } from '@/components/ui/button';
import DocsLayout from '@/layouts/docs-layout';

const stats = [
    { label: 'Editors', value: '2' },
    { label: 'VS Code', value: 'Marketplace' },
    { label: 'Vim/Neovim', value: 'GitHub' },
];

const features = [
    {
        icon: FolderKanban,
        title: 'Browse boards & cards',
        description: 'View your projects, boards, and cards without leaving your editor.',
    },
    {
        icon: Code2,
        title: 'Log work inline',
        description: 'Create work log entries from the command palette while you code.',
    },
    {
        icon: MessageSquare,
        title: 'Quick card creation',
        description: 'Turn a TODO comment or selected text into a card in seconds.',
    },
    {
        icon: Plug,
        title: 'MCP token auth',
        description: 'Uses the same MCP token as Claude and other AI clients — one token for everything.',
    },
];

const vimSetup = `" Add to your init.vim / init.lua
" Using vim-plug:
Plug 'myneid/whhid-vim'

" Then configure:
let g:whhid_token = 'YOUR_MCP_TOKEN_HERE'
let g:whhid_url   = 'https://whatthehellhaveidone.net'`;

export default function DocsEditorPlugins() {
    return (
        <>
            <Head title="Editor Plugins – Docs" />

            <div className="not-prose space-y-12">
                <DocsHero
                    eyebrow="Integrations"
                    eyebrowIcon={Code2}
                    title="Editor Plugins"
                    description="Manage cards, log work, and browse your boards without ever leaving your editor. Available for VS Code and Vim / Neovim."
                    stats={stats}
                    actions={
                        <>
                            <Button variant="brand" asChild>
                                <a
                                    href="https://marketplace.visualstudio.com/items?itemName=0x7a69.whhid"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Download className="size-4" />
                                    Install for VS Code
                                </a>
                            </Button>
                            <Button variant="outline" asChild>
                                <a
                                    href="https://github.com/myneid/whhid-vim"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Vim plugin on GitHub
                                </a>
                            </Button>
                        </>
                    }
                />

                <DocsPageSection
                    icon={Code2}
                    title="What you can do"
                    description="Both plugins expose the same core features via your editor's command palette or keyboard shortcuts."
                >
                    <DocsFeatureGrid features={features} columns={2} />
                </DocsPageSection>

                <DocsPageSection
                    icon={Terminal}
                    title="VS Code extension"
                    description="Install from the Visual Studio Marketplace in one click."
                >
                    <div className="space-y-4">
                        <DocsConceptCard icon={Download} title="Install">
                            <p>
                                Open VS Code, go to the Extensions panel (
                                <code>Ctrl+Shift+X</code> / <code>⌘⇧X</code>), and search for{' '}
                                <strong>whhid</strong>, or install directly from the Marketplace:
                            </p>
                            <p>
                                <DocsExternalLink href="https://marketplace.visualstudio.com/items?itemName=0x7a69.whhid">
                                    marketplace.visualstudio.com → 0x7a69.whhid
                                </DocsExternalLink>
                            </p>
                        </DocsConceptCard>

                        <DocsConceptCard icon={Plug} title="Configure">
                            <p>
                                After installing, add your MCP token to VS Code settings (
                                <code>Ctrl+,</code> / <code>⌘,</code>):
                            </p>
                            <ul className="list-inside list-disc space-y-1.5">
                                <li>
                                    <strong>whhid.token</strong> — your MCP token (create one under{' '}
                                    <Link href="/mcp-tokens" className="hover-docs-link">
                                        Settings → MCP Tokens
                                    </Link>
                                    )
                                </li>
                                <li>
                                    <strong>whhid.url</strong> — leave as-is for the hosted version,
                                    or set your self-hosted domain
                                </li>
                            </ul>
                        </DocsConceptCard>
                    </div>
                </DocsPageSection>

                <DocsPageSection
                    icon={Terminal}
                    title="Vim / Neovim plugin"
                    description="A lightweight Vimscript plugin that works with any plugin manager."
                >
                    <div className="space-y-4">
                        <DocsConceptCard icon={Download} title="Install">
                            <p>
                                The plugin is hosted on GitHub:{' '}
                                <DocsExternalLink href="https://github.com/myneid/whhid-vim">
                                    github.com/myneid/whhid-vim
                                </DocsExternalLink>
                            </p>
                            <p>Add it with your plugin manager, then set your token and URL:</p>
                            <DocsCodeBlock>{vimSetup}</DocsCodeBlock>
                        </DocsConceptCard>

                        <DocsConceptCard icon={Plug} title="Get your token">
                            <p>
                                Generate an MCP token under{' '}
                                <Link href="/mcp-tokens" className="hover-docs-link">
                                    Settings → MCP Tokens
                                </Link>
                                . The same token works for the Vim plugin, VS Code, and Claude — you
                                only need one.
                            </p>
                        </DocsConceptCard>
                    </div>
                </DocsPageSection>

                <DocsCtaCard
                    title="Need a token?"
                    description={
                        <>
                            Both plugins authenticate with an MCP token. Create one under{' '}
                            <Link href="/mcp-tokens" className="hover-docs-link">
                                Settings → MCP Tokens
                            </Link>
                            .
                        </>
                    }
                    actionLabel="Create MCP token"
                    actionHref="/mcp-tokens"
                />

                <DocsNextSteps
                    steps={[
                        {
                            title: 'MCP Setup',
                            description: 'Connect Claude, Cursor, or any AI client via MCP.',
                            href: '/docs/mcp-setup',
                            icon: Bot,
                        },
                        {
                            title: 'MCP Tools reference',
                            description: 'Full list of tools your editor and AI agents can call.',
                            href: '/docs/mcp-tools',
                            icon: Plug,
                        },
                        {
                            title: 'Work Log',
                            description: 'Log and query work with hashtag-based entries.',
                            href: '/docs/work-log',
                            icon: MessageSquare,
                        },
                    ]}
                />
            </div>
        </>
    );
}

DocsEditorPlugins.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
