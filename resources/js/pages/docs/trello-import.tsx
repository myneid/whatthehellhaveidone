import { Head } from '@inertiajs/react';
import DocsLayout from '@/layouts/docs-layout';

export default function DocsTrelloImport() {
    return (
        <>
            <Head title="Trello Import – Docs" />

            <h1>Import from Trello</h1>

            <p>
                Migrate your existing Trello boards in a few clicks. Lists, cards, labels, checklists, and due dates are all imported automatically.
            </p>

            <h2>Export from Trello</h2>
            <ol>
                <li>Open your Trello board.</li>
                <li>Click <strong>Show Menu</strong> → <strong>More</strong> → <strong>Print and Export</strong>.</li>
                <li>Choose <strong>Export as JSON</strong> and save the file.</li>
            </ol>

            <h2>Import into a Board</h2>
            <ol>
                <li>Open (or create) a board in your workspace.</li>
                <li>Click <strong>Settings</strong> in the board header.</li>
                <li>Scroll to <strong>Import from Trello</strong>.</li>
                <li>Click the upload area and select your exported <code>.json</code> file.</li>
                <li>Click <strong>Import Board</strong>.</li>
            </ol>
            <p>
                The import runs as a background job. You'll be redirected to a status page that auto-refreshes until it completes.
            </p>

            <h2>What Gets Imported</h2>
            <ul>
                <li><strong>Lists</strong> — all non-archived lists, preserving order.</li>
                <li><strong>Cards</strong> — all open cards with title, description, due date, and position.</li>
                <li><strong>Labels</strong> — Trello label colors are mapped to hex colors.</li>
                <li><strong>Checklists</strong> — all checklist items with completion state.</li>
            </ul>

            <h2>What Is Not Imported</h2>
            <ul>
                <li>Archived lists and cards</li>
                <li>Attachments (file contents)</li>
                <li>Member assignments (Trello members must be matched to users manually)</li>
                <li>Comments</li>
                <li>Card activity history</li>
            </ul>

            <h2>Troubleshooting</h2>
            <p>If the import fails, check the error message on the status page. Common causes:</p>
            <ul>
                <li>The file is not a valid Trello JSON export (must contain a <code>name</code> field at the root).</li>
                <li>The file exceeds 10 MB.</li>
            </ul>
            <p>
                Make sure your application queue worker is running: <code>php artisan queue:work</code>.
                The import is processed asynchronously and will not run without a worker.
            </p>
        </>
    );
}

DocsTrelloImport.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
