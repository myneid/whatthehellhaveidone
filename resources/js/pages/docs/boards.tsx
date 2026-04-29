import { Head, Link } from '@inertiajs/react';
import DocsLayout from '@/layouts/docs-layout';

export default function DocsBoards() {
    return (
        <>
            <Head title="Projects & Boards – Docs" />

            <h1>Projects &amp; Boards</h1>

            <h2>Projects</h2>
            <p>
                A <strong>project</strong> is the top-level container. It groups related boards together and defines a team of members
                who can access everything inside it.
            </p>
            <ul>
                <li>Create a project from the dashboard with <strong>New Project</strong>.</li>
                <li>Invite team members from the project's <strong>Members</strong> tab.</li>
                <li>Archive a project to hide it without deleting it.</li>
            </ul>

            <h2>Boards</h2>
            <p>
                A <strong>board</strong> is a Kanban board. It lives inside a project or stands alone. Each board has lists (columns)
                that contain cards (tasks).
            </p>

            <h3>Visibility</h3>
            <ul>
                <li><strong>Private</strong> — only you can see it.</li>
                <li><strong>Team</strong> — visible to all project members (default).</li>
                <li><strong>Public</strong> — anyone with the URL can view (but not edit).</li>
            </ul>

            <h2>Lists</h2>
            <p>
                Lists are the columns of your board. Add them with <strong>+ Add list</strong> at the right edge of the board.
                Drag a card from one list to another to move it.
            </p>

            <h2>Cards</h2>
            <p>Cards are individual tasks. Click a card to open its detail view.</p>

            <h3>Card fields</h3>
            <ul>
                <li><strong>Title &amp; Description</strong> — click to edit inline.</li>
                <li><strong>Priority</strong> — None, Low, Medium, High, Critical. Shown as a colored left border on the card.</li>
                <li><strong>Due date</strong> — shown on the card thumbnail.</li>
                <li><strong>Assignees</strong> — team members responsible for the card.</li>
                <li><strong>Labels</strong> — colored tags for categorization.</li>
                <li><strong>Checklists</strong> — multi-step sub-tasks with progress tracking.</li>
                <li><strong>Comments</strong> — discussion thread on the card.</li>
                <li><strong>Attachments</strong> — file uploads.</li>
                <li><strong>GitHub issue link</strong> — connect to a GitHub issue for sync.</li>
            </ul>

            <h2>Keyboard Tips</h2>
            <ul>
                <li>Press <kbd>Escape</kbd> while adding a card to cancel.</li>
                <li>Drag cards by the grip handle that appears on hover.</li>
            </ul>

            <h2>Labels</h2>
            <p>
                Labels are board-scoped. Create them in the board settings sheet. Assign multiple labels to a card.
                Labels show as colored dots on the card thumbnail.
            </p>

            <h2>Archiving</h2>
            <p>
                Archive a card from its detail view to hide it without deleting. Archived cards can be restored. Archiving a board
                removes it from the active list but preserves all data.
            </p>

            <h2>Next Steps</h2>
            <ul>
                <li><Link href="/docs/github">Connect a GitHub repository →</Link></li>
                <li><Link href="/docs/mcp-setup">Let your AI assistant manage cards →</Link></li>
            </ul>
        </>
    );
}

DocsBoards.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
