import { Head } from '@inertiajs/react';
import DocsLayout from '@/layouts/docs-layout';

export default function DocsWorkLog() {
    return (
        <>
            <Head title="Work Log – Docs" />

            <h1>Work Log</h1>

            <p>
                The Work Log is a journal for tracking what you've worked on. Entries can be linked to projects and cards using hashtags,
                making it easy to build a timeline of activity across your workspace.
            </p>

            <h2>Creating Entries</h2>
            <p>
                Go to <strong>Work Log</strong> from the main navigation. Click <strong>New Entry</strong> and write what you did.
                You can also create entries via the MCP server from your AI assistant.
            </p>

            <h2>Hashtag Linking</h2>
            <p>
                Use hashtags in your entry body to associate it with a project:
            </p>
            <pre className="my-3 rounded-lg bg-muted p-4 text-sm font-mono not-prose">
                Fixed the login redirect bug #projectslug
            </pre>
            <p>
                The hashtag is matched against project slugs. If found, the entry is linked to that project automatically.
            </p>

            <h2>Time Tracking</h2>
            <p>
                Entries can optionally include <code>started_at</code> and <code>ended_at</code> timestamps to track duration.
                This is most useful when creating entries via the MCP server or API.
            </p>

            <h2>Filtering and Export</h2>
            <p>
                The Work Log page supports filtering by:
            </p>
            <ul>
                <li>Date range</li>
                <li>Source (manual, API, GitHub, etc.)</li>
                <li>Search text</li>
            </ul>
            <p>
                Use <strong>Export</strong> to download entries as CSV or JSON for use in time-tracking tools or reports.
            </p>

            <h2>Using the MCP Server</h2>
            <p>Your AI assistant can log work for you:</p>
            <ul>
                <li>"Log 2 hours of backend work on the auth system #myproject"</li>
                <li>"What did I work on today?"</li>
                <li>"Show my work log for last Monday"</li>
            </ul>
        </>
    );
}

DocsWorkLog.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
