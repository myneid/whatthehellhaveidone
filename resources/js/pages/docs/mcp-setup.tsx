import { Head, Link } from '@inertiajs/react';
import DocsLayout from '@/layouts/docs-layout';

function Code({ children }: { children: string }) {
    return (
        <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono leading-relaxed not-prose">
            <code>{children}</code>
        </pre>
    );
}

export default function DocsMcpSetup() {
    return (
        <>
            <Head title="MCP Setup – What the HELL have I done">
                <meta name="description" content="Connect Claude, ChatGPT, or any MCP-compatible AI assistant to your boards, cards, and work log via the built-in MCP server." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://whatthehellhaveidone.net/docs/mcp-setup" />
                <meta property="og:title" content="MCP Setup – What the HELL have I done" />
                <meta property="og:description" content="Connect Claude, ChatGPT, or any MCP-compatible AI assistant to your boards, cards, and work log via the built-in MCP server." />
                <meta property="og:image" content="https://whatthehellhaveidone.net/whatthehellhaveidone.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MCP Setup – What the HELL have I done" />
                <meta name="twitter:description" content="Connect Claude, ChatGPT, or any MCP-compatible AI assistant to your boards, cards, and work log via the built-in MCP server." />
                <meta name="twitter:image" content="https://whatthehellhaveidone.net/whatthehellhaveidone.png" />
            </Head>

            <h1>MCP Setup</h1>

            <p>
                What the HELL have I done exposes a{' '}
                <a href="https://modelcontextprotocol.io" target="_blank" rel="noopener noreferrer">Model Context Protocol</a>{' '}
                (MCP) server. This lets AI assistants like Claude or ChatGPT read and write your boards, cards, and work log directly —
                without copy-pasting anything.
            </p>

            <h2>Step 1 — Create an MCP Token</h2>
            <p>
                Go to <Link href="/mcp-tokens">Settings → MCP Tokens</Link> and click <strong>Create</strong>.
                Give it a descriptive name (e.g. "Claude Desktop").
            </p>
            <p>
                <strong>Copy the token immediately</strong> — it is shown only once. This token acts as your API key for the MCP server.
            </p>

            <h2>Step 2 — Note the MCP Server URL</h2>
            <p>The MCP endpoint URL is:</p>
            <Code>https://whatthehellhaveidone.net/mcp/whhid</Code>
            <p>If you're self-hosting, replace the domain with your own.</p>

            <h2>Step 3 — Configure Your AI Assistant</h2>

            <h3>Claude Desktop</h3>
            <p>
                Open your Claude Desktop config file. On macOS it lives at{' '}
                <code>~/Library/Application Support/Claude/claude_desktop_config.json</code>.
            </p>
            <Code>{`{
  "mcpServers": {
    "whatthehellhaveidone": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://whatthehellhaveidone.net/mcp/whhid",
        "--header",
        "Authorization:Bearer YOUR_TOKEN_HERE"
      ]
    }
  }
}`}</Code>
            <p>Restart Claude Desktop after saving. You should see "whatthehellhaveidone" in the tools list.</p>

            <h3>Claude Code (CLI)</h3>
            <p>Add the server via the CLI:</p>
            <Code>{`claude mcp add whatthehellhaveidone \\
  --transport http \\
  --url https://whatthehellhaveidone.net/mcp/whhid \\
  --header "Authorization: Bearer YOUR_TOKEN_HERE"`}</Code>

            <h3>ChatGPT / OpenAI</h3>
            <p>
                In a GPT's configuration or via the Assistants API, add a custom action pointing at the MCP endpoint.
                Set the <code>Authorization</code> header to <code>Bearer YOUR_TOKEN_HERE</code>.
            </p>
            <p>
                Note: full MCP support in ChatGPT requires the MCP-compatible plugin interface. Check OpenAI's docs for the
                latest support status.
            </p>

            <h3>Cursor / Other MCP Clients</h3>
            <p>Any client that supports HTTP-based MCP can connect using:</p>
            <ul>
                <li><strong>URL:</strong> <code>https://whatthehellhaveidone.net/mcp/whhid</code></li>
                <li><strong>Transport:</strong> HTTP (Streamable HTTP)</li>
                <li><strong>Auth:</strong> Bearer token in <code>Authorization</code> header</li>
            </ul>

            <h2>Available Tools</h2>
            <p>Once connected, the AI can use these tools:</p>
            <div className="not-prose overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-2 text-left font-medium">Tool</th>
                            <th className="px-4 py-2 text-left font-medium">What it does</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {[
                            ['list_projects', 'List all your projects'],
                            ['get_board', 'Get a board with its lists and cards'],
                            ['list_cards', 'List cards in a board (filterable by list, priority)'],
                            ['get_card', 'Get full card details including comments and checklists'],
                            ['create_card', 'Create a new card in a list'],
                            ['move_card', 'Move a card to a different list'],
                            ['create_work_log_entry', 'Log work with hashtag-based project tagging'],
                            ['get_daily_work_log', 'Retrieve today\'s (or any date\'s) work log'],
                            ['list_documents', 'List documents in a project'],
                            ['get_document', 'Read a project document\'s full content'],
                        ].map(([tool, desc]) => (
                            <tr key={tool}>
                                <td className="px-4 py-2 font-mono text-xs">{tool}</td>
                                <td className="px-4 py-2 text-muted-foreground">{desc}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2>Example Prompts</h2>
            <p>Once connected, you can ask your AI assistant things like:</p>
            <ul>
                <li>"Show me all open cards in the API board"</li>
                <li>"Create a card titled 'Fix login bug' in the To Do list on my main board"</li>
                <li>"Move the 'Deploy to production' card to Done"</li>
                <li>"Log that I spent 2 hours fixing the auth issue #backend"</li>
                <li>"What did I work on today?"</li>
            </ul>

            <h2>Security</h2>
            <p>
                Each token grants full access to your account's data. Treat it like a password. If a token is compromised,
                revoke it immediately from <Link href="/mcp-tokens">Settings → MCP Tokens</Link>.
            </p>
            <p>Tokens do not expire automatically — revoke them manually when no longer needed.</p>
        </>
    );
}

DocsMcpSetup.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
