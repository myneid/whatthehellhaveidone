import { Head, Link } from '@inertiajs/react';
import DocsLayout from '@/layouts/docs-layout';

export default function DocsGettingStarted() {
    return (
        <>
            <Head title="Getting Started – Docs" />

            <h1>Getting Started</h1>

            <p>
                This guide walks you through setting up your workspace: creating a project, adding a board, and inviting your team.
            </p>

            <h2>1. Create an Account</h2>
            <p>
                Register at <a href="/register">/register</a>. You can also sign in with an existing account if your admin has already added you.
            </p>

            <h2>2. Create a Project</h2>
            <p>
                From the Dashboard, click <strong>New Project</strong>. A project is a container for boards — think of it as a team workspace or a product area.
            </p>
            <ul>
                <li><strong>Name</strong> — the project's display name.</li>
                <li><strong>Color</strong> — optional accent color shown on the dashboard.</li>
            </ul>

            <h2>3. Create a Board</h2>
            <p>
                Inside a project, click <strong>New Board</strong>. Boards are Kanban-style — they hold lists (columns) of cards.
                You can also create standalone boards not attached to any project from the dashboard.
            </p>
            <ul>
                <li><strong>Visibility</strong> — <code>private</code> (only you), <code>team</code> (project members), or <code>public</code> (anyone with the link).</li>
                <li><strong>Background color</strong> — optional header accent.</li>
            </ul>

            <h2>4. Add Lists and Cards</h2>
            <p>
                Open a board and use <strong>+ Add list</strong> to create columns (e.g. "To Do", "In Progress", "Done").
                Inside each list, click <strong>+ Add card</strong> to create a task.
            </p>
            <p>
                Click any card to open the detail view where you can:
            </p>
            <ul>
                <li>Edit the title and description</li>
                <li>Assign members</li>
                <li>Set a priority and due date</li>
                <li>Add checklists, comments, and attachments</li>
                <li>Link a GitHub issue</li>
            </ul>
            <p>Drag cards between lists to update their status.</p>

            <h2>5. Invite Team Members</h2>
            <p>
                Open a project and go to the <strong>Members</strong> tab. You can add existing users by email or send an invitation link to people who haven't signed up yet.
            </p>
            <p>Board-level members can be managed from the board's <strong>Settings</strong> sheet.</p>

            <h2>Next Steps</h2>
            <ul>
                <li><Link href="/docs/mcp-setup">Connect an AI assistant via MCP →</Link></li>
                <li><Link href="/docs/github">Set up GitHub integration →</Link></li>
                <li><Link href="/docs/trello-import">Import from Trello →</Link></li>
            </ul>
        </>
    );
}

DocsGettingStarted.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
