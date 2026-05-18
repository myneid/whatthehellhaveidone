import { Head, Link } from '@inertiajs/react';
import { Bot, GitBranch, ListChecks, User } from 'lucide-react';
import { DocsCallout, DocsTable } from '@/components/docs/docs-table';
import DocsLayout from '@/layouts/docs-layout';

const workflowSteps = [
    {
        step: 'Move to In Progress',
        detail: 'Creates a linked GitHub issue and prompts for who should work on it',
    },
    {
        step: 'Assign on move',
        detail: 'Choose GitHub Copilot or a board team member',
    },
    {
        step: 'Open a pull request',
        detail: 'Card moves to Review when the PR references the issue',
    },
    {
        step: 'Copilot review',
        detail: 'Requested automatically only if the card was assigned to Copilot on move',
    },
];

export default function DocsGitHubWorkflow() {
    return (
        <>
            <Head title="GitHub Board Workflow – Docs" />

            <h1>GitHub + Board Workflow</h1>

            <p>
                This page summarizes the GitHub-connected sprint workflow: issue creation on move,
                assign-on-move (Copilot or team member), and automatic Review column movement with
                optional Copilot PR review.
            </p>

            <DocsCallout>
                The same content lives in the repo as{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                    GITHUB-BOARD-WORKFLOW.md
                </code>{' '}
                for sharing outside the app.
            </DocsCallout>

            <h2>What we built</h2>

            <DocsTable
                headers={['Step', 'What happens']}
                rows={workflowSteps.map((row) => [row.step, row.detail])}
            />

            <h2>One-time board setup</h2>
            <ol>
                <li>
                    <Link href="/settings/integrations">Settings → Integrations</Link> — connect
                    GitHub.
                </li>
                <li>
                    Board <strong>Settings</strong> → connect the repository.
                </li>
                <li>
                    In Progress column (<span className="font-mono text-xs">⋯</span>) →{' '}
                    <strong>Create GitHub issue</strong>.
                </li>
                <li>
                    Board settings → <strong>Pull request automation</strong> → target{' '}
                    <strong>Review</strong>.
                </li>
                <li>Add board members (non-viewer) for the team picker.</li>
            </ol>

            <h2>Per card</h2>
            <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
                {[
                    {
                        icon: ListChecks,
                        title: 'Move to In Progress',
                        body: 'Drag the card or use the move controls.',
                    },
                    {
                        icon: Bot,
                        title: 'Choose who works on it',
                        body: 'Copilot, a team member, or skip for now.',
                    },
                    {
                        icon: GitBranch,
                        title: 'Open a PR',
                        body: 'Use Fixes #123 or #123 in the title or body.',
                    },
                    {
                        icon: User,
                        title: 'Review column',
                        body: 'Card moves automatically; Copilot review only if you picked Copilot.',
                    },
                ].map((item) => (
                    <div
                        key={item.title}
                        className="flex gap-3 rounded-lg border bg-card p-4"
                    >
                        <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <div>
                            <p className="font-medium text-foreground">{item.title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
                        </div>
                    </div>
                ))}
            </div>

            <h2>Copilot vs team member</h2>

            <DocsTable
                headers={['', 'GitHub Copilot', 'Team member']}
                rows={[
                    ['Board assignee', 'Cleared', 'Set on the card'],
                    ['GitHub issue assignee', 'Copilot agent', 'Not set by the app'],
                    ['Auto Copilot PR review', 'Yes', 'No'],
                    ['Moves to Review on PR', 'Yes', 'Yes'],
                ]}
            />

            <h2>Local testing</h2>
            <p>
                GitHub webhooks require HTTPS. Run <code>php artisan queue:work</code>, tunnel the
                app, set <code>APP_URL</code>, then reconnect the repository in board settings.
            </p>
            <p>
                <Link href="/docs/github" className="font-medium text-primary hover:underline">
                    GitHub Integration docs →
                </Link>
            </p>

            <h2>Not included yet</h2>
            <ul className="text-muted-foreground">
                <li>Human as GitHub issue assignee</li>
                <li>Project invitees who are not board members</li>
                <li>Live board refresh when webhooks move cards</li>
            </ul>
        </>
    );
}

DocsGitHubWorkflow.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
