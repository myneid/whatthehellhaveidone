import { Head, Link } from '@inertiajs/react';
import DocsLayout from '@/layouts/docs-layout';

export default function DocsGitHub() {
    return (
        <>
            <Head title="GitHub Integration – Docs" />

            <h1>GitHub Integration</h1>

            <p>
                Connect your GitHub account to sync issues with board cards. You can import open issues as cards,
                create GitHub issues from cards, and keep them in sync bi-directionally.
            </p>

            <h2>Prerequisites — GitHub OAuth App</h2>
            <p>
                Before using the GitHub integration, a GitHub OAuth App must be configured on the server.
                If you're using the hosted version at <a href="https://whatthehellhaveidone.net">whatthehellhaveidone.net</a>,
                this is already done for you.
            </p>
            <p>If you're <strong>self-hosting</strong>, follow these steps:</p>
            <ol>
                <li>
                    Go to <a href="https://github.com/settings/developers" target="_blank" rel="noopener noreferrer">
                        GitHub → Settings → Developer settings → OAuth Apps
                    </a> and click <strong>New OAuth App</strong>.
                </li>
                <li>Set the <strong>Authorization callback URL</strong> to <code>https://your-domain.com/github/callback</code>.</li>
                <li>Copy the <strong>Client ID</strong> and generate a <strong>Client Secret</strong>.</li>
                <li>Add them to your <code>.env</code> file:
                    <pre className="my-2 rounded-lg bg-muted p-4 text-sm font-mono not-prose">{`GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URL=https://your-domain.com/github/callback`}</pre>
                </li>
                <li>Run <code>php artisan config:clear</code> to reload.</li>
            </ol>

            <h2>Connect Your GitHub Account</h2>
            <ol>
                <li>Go to <Link href="/settings/integrations">Settings → Integrations</Link>.</li>
                <li>Click <strong>Connect GitHub Account</strong>.</li>
                <li>Authorize the app on GitHub — you'll be redirected back automatically.</li>
            </ol>
            <p>You can connect multiple GitHub accounts if needed.</p>

            <h2>Link a Repository to a Board</h2>
            <ol>
                <li>Open a board and click <strong>Settings</strong> in the top-right.</li>
                <li>Under <strong>GitHub Integration</strong>, select a repository from the dropdown.</li>
                <li>Click <strong>Connect Repository</strong>.</li>
            </ol>

            <h2>Import GitHub Issues as Cards</h2>
            <p>
                Once a repository is connected, click the <strong>refresh icon</strong> next to the repo name in board settings.
                Open issues will be imported as cards in the first list of the board.
            </p>

            <h2>Create a GitHub Issue from a Card</h2>
            <p>Open a card and use the GitHub panel to create a new issue or link to an existing one.</p>

            <h2>Sync Direction</h2>
            <p>The integration supports:</p>
            <ul>
                <li><strong>Two-way sync</strong> — changes in GitHub reflect in the board and vice versa (requires webhook setup).</li>
                <li><strong>Import only</strong> — pull issues into the board without pushing changes back.</li>
            </ul>
        </>
    );
}

DocsGitHub.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
