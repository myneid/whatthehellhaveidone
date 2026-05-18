import { Head, Link } from '@inertiajs/react';
import { Bot, Github, Upload } from 'lucide-react';
import { DocsNextSteps } from '@/components/docs/docs-next-steps';
import { DocsPageHeader } from '@/components/docs/docs-page-header';
import { DocsStepCard } from '@/components/docs/docs-step-card';
import { Button } from '@/components/ui/button';
import DocsLayout from '@/layouts/docs-layout';

export default function DocsGettingStarted() {
    return (
        <>
            <Head title="Getting Started – Docs" />

            <div className="not-prose space-y-10">
                <DocsPageHeader
                    badge="Quick Start"
                    title="Getting Started"
                    description="Set up your workspace in five steps — create a project, add a board, and invite your team."
                >
                    <div className="flex flex-wrap gap-3">
                        <Button asChild>
                            <Link href="/register">Create account</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/docs">Back to intro</Link>
                        </Button>
                    </div>
                </DocsPageHeader>

                <div className="space-y-4">
                    <DocsStepCard step={1} title="Create an Account">
                        <p>
                            Register at <Link href="/register">/register</Link>. You can also sign
                            in with an existing account if your admin has already added you.
                        </p>
                    </DocsStepCard>

                    <DocsStepCard step={2} title="Create a Project">
                        <p>
                            From the Dashboard, click <strong>New Project</strong>. A project is a
                            container for boards — think of it as a team workspace or a product
                            area.
                        </p>
                        <ul>
                            <li>
                                <strong>Name</strong> — the project&apos;s display name.
                            </li>
                            <li>
                                <strong>Color</strong> — optional accent color shown on the
                                dashboard.
                            </li>
                        </ul>
                    </DocsStepCard>

                    <DocsStepCard step={3} title="Create a Board">
                        <p>
                            Inside a project, click <strong>New Board</strong>. Boards are
                            Kanban-style — they hold lists (columns) of cards. You can also create
                            standalone boards not attached to any project from the dashboard.
                        </p>
                        <ul>
                            <li>
                                <strong>Visibility</strong> — <code>private</code> (only you),{' '}
                                <code>team</code> (project members), or <code>public</code> (anyone
                                with the link).
                            </li>
                            <li>
                                <strong>Background color</strong> — optional header accent.
                            </li>
                        </ul>
                    </DocsStepCard>

                    <DocsStepCard step={4} title="Add Lists and Cards">
                        <p>
                            Open a board and use <strong>+ Add list</strong> to create columns (e.g.
                            &quot;To Do&quot;, &quot;In Progress&quot;, &quot;Done&quot;). Inside
                            each list, click <strong>+ Add card</strong> to create a task.
                        </p>
                        <p>Click any card to open the detail view where you can:</p>
                        <ul>
                            <li>Edit the title and description</li>
                            <li>Assign members</li>
                            <li>Set a priority and due date</li>
                            <li>Add checklists, comments, and attachments</li>
                            <li>Link a GitHub issue</li>
                        </ul>
                        <p>Drag cards between lists to update their status.</p>
                    </DocsStepCard>

                    <DocsStepCard step={5} title="Invite Team Members">
                        <p>
                            Open a project and go to the <strong>Members</strong> tab. You can add
                            existing users by email or send an invitation link to people who
                            haven&apos;t signed up yet.
                        </p>
                        <p>
                            Board-level members can be managed from the board&apos;s{' '}
                            <strong>Settings</strong> sheet.
                        </p>
                    </DocsStepCard>
                </div>

                <DocsNextSteps
                    steps={[
                        {
                            title: 'Connect an AI assistant',
                            description: 'Hook up Claude or ChatGPT via MCP.',
                            href: '/docs/mcp-setup',
                            icon: Bot,
                        },
                        {
                            title: 'GitHub integration',
                            description: 'Sync issues with board cards both ways.',
                            href: '/docs/github',
                            icon: Github,
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

DocsGettingStarted.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
