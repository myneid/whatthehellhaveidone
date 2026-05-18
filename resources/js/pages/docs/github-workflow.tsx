import { Head, Link } from '@inertiajs/react';
import DocsLayout from '@/layouts/docs-layout';

export default function DocsGitHubWorkflow() {
    return (
        <>
            <Head title="GitHub Board Workflow – Docs" />

            <h1>GitHub + Board Workflow</h1>

            <p>
                This page summarizes the GitHub-connected sprint workflow: issue creation on move,
                assign-on-move (Copilot or team member), and automatic Review column + Copilot PR review.
            </p>

            <p className="text-sm text-muted-foreground">
                The same content lives in the repo as{' '}
                <code>GITHUB-BOARD-WORKFLOW.md</code> for sharing outside the app.
            </p>

            <h2>What we built</h2>
            <table>
                <thead>
                    <tr>
                        <th>Step</th>
                        <th>What happens</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Move to In Progress</td>
                        <td>Creates a linked GitHub issue and prompts for who should work on it</td>
                    </tr>
                    <tr>
                        <td>Assign on move</td>
                        <td>Choose GitHub Copilot or a board team member</td>
                    </tr>
                    <tr>
                        <td>Open a pull request</td>
                        <td>Card moves to Review when the PR references the issue</td>
                    </tr>
                    <tr>
                        <td>Copilot review</td>
                        <td>Requested automatically only if the card was assigned to Copilot on move</td>
                    </tr>
                </tbody>
            </table>

            <h2>One-time board setup</h2>
            <ol>
                <li>
                    <Link href="/settings/integrations">Settings → Integrations</Link> — connect GitHub.
                </li>
                <li>Board <strong>Settings</strong> → connect the repository.</li>
                <li>In Progress column (⋯) → <strong>Create GitHub issue</strong>.</li>
                <li>Board settings → <strong>Pull request automation</strong> → target <strong>Review</strong>.</li>
                <li>Add board members (non-viewer) for the team picker.</li>
            </ol>

            <h2>Per card</h2>
            <ol>
                <li>Move the card to In Progress.</li>
                <li>Choose Copilot, a team member, or skip.</li>
                <li>Open a PR with <code>Fixes #123</code> (or <code>#123</code> in title/body).</li>
                <li>Card moves to Review; Copilot review only if you chose Copilot on move.</li>
            </ol>

            <h2>Copilot vs team member</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>GitHub Copilot</th>
                        <th>Team member</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Board assignee</td>
                        <td>Cleared</td>
                        <td>Set on the card</td>
                    </tr>
                    <tr>
                        <td>GitHub issue assignee</td>
                        <td>Copilot agent</td>
                        <td>Not set by the app</td>
                    </tr>
                    <tr>
                        <td>Auto Copilot PR review</td>
                        <td>Yes</td>
                        <td>No</td>
                    </tr>
                    <tr>
                        <td>Moves to Review on PR</td>
                        <td>Yes</td>
                        <td>Yes</td>
                    </tr>
                </tbody>
            </table>

            <h2>Local testing</h2>
            <p>GitHub webhooks need HTTPS. Run <code>php artisan queue:work</code>, tunnel the app, set <code>APP_URL</code>, reconnect the repo.</p>
            <p>
                Details: <Link href="/docs/github">GitHub Integration docs →</Link>
            </p>

            <h2>Not included yet</h2>
            <ul>
                <li>Human as GitHub issue assignee</li>
                <li>Project invitees who are not board members</li>
                <li>Live board refresh when webhooks move cards</li>
            </ul>
        </>
    );
}

DocsGitHubWorkflow.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
