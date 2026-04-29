import { Head } from '@inertiajs/react';
import DocsLayout from '@/layouts/docs-layout';

export default function DocsDiscord() {
    return (
        <>
            <Head title="Discord Notifications – Docs" />

            <h1>Discord Notifications</h1>

            <p>
                Get notified in a Discord channel whenever cards are created, moved, or updated on your board.
            </p>

            <h2>Create a Discord Webhook</h2>
            <ol>
                <li>In Discord, right-click the channel you want to notify and choose <strong>Edit Channel</strong>.</li>
                <li>Go to <strong>Integrations → Webhooks → New Webhook</strong>.</li>
                <li>Give it a name and copy the <strong>Webhook URL</strong>.</li>
            </ol>

            <h2>Add the Webhook to a Board</h2>
            <ol>
                <li>Open a board and click <strong>Settings</strong> in the top-right.</li>
                <li>Scroll to <strong>Discord Webhook</strong>.</li>
                <li>Enter a name (e.g. <code>#dev-updates</code>) and paste the webhook URL.</li>
                <li>Click <strong>Save Webhook</strong>.</li>
            </ol>

            <h2>Test the Webhook</h2>
            <p>
                After saving, click <strong>Test</strong> to send a test message to the channel and confirm delivery.
            </p>

            <h2>Events</h2>
            <p>Notifications are sent for the following events by default:</p>
            <ul>
                <li>Card created</li>
                <li>Card moved between lists</li>
            </ul>
            <p>Additional events can be configured in future releases.</p>

            <h2>Managing the Webhook</h2>
            <p>
                To update the webhook name or URL, re-open board settings and edit the fields. To remove it, click the trash icon.
            </p>
        </>
    );
}

DocsDiscord.layout = (page: React.ReactNode) => <DocsLayout>{page}</DocsLayout>;
