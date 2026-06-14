import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Download, Plus, Search } from 'lucide-react';
import { MobileButton } from '@/components/mobile/edge/MobileButton';
import { MobileCard } from '@/components/mobile/edge/MobileCard';
import { MobileInput } from '@/components/mobile/edge/MobileInput';
import { MobileShell } from '@/components/mobile/edge/MobileShell';
import { dashboard } from '@/routes';
import { exportMethod as workLogExport, index as workLogIndex, store as workLogStore } from '@/routes/work-log';
import type { Paginated, WorkLogEntry } from '@/types/app';

type Filters = {
    search?: string;
    project_id?: string;
    board_id?: string;
    source?: string;
    entry_type?: string;
    date_from?: string;
    date_to?: string;
};

type Props = {
    entries: Paginated<WorkLogEntry>;
    filters: Filters;
};

function formatDuration(seconds: number | null): string {
    if (!seconds) {
        return 'No duration';
    }

    if (seconds < 60) {
        return `${seconds}s`;
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}m`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
}

export default function MobileWorkLogIndex({ entries, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const form = useForm({ body: '', duration_minutes: '' });

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        router.get(workLogIndex().url, { ...filters, search }, { preserveState: true, replace: true });
    }

    function submitEntry(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.transform((data) => ({
            body: data.body,
            duration_seconds: data.duration_minutes ? Math.round(Number(data.duration_minutes) * 60) : null,
        }));

        form.post(workLogStore().url, {
            onSuccess: () => {
                form.reset();
            },
        });
    }

    function exportData(format: 'json' | 'csv') {
        window.location.href = workLogExport.url({
            query: {
                format,
                date_from: filters.date_from,
                date_to: filters.date_to,
            },
        });
    }

    return (
        <MobileShell
            header={
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-xl font-bold">Work Log</h1>
                        <p className="text-xs text-muted-foreground">Track recent work from mobile</p>
                    </div>
                    <Link href={dashboard().url} className="text-xs text-muted-foreground">
                        Dashboard
                    </Link>
                </div>
            }
        >
            <div className="space-y-6 pb-24">
                <MobileCard title="New Entry" subtitle="Quick capture from the field">
                    <form onSubmit={submitEntry} className="space-y-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium leading-none">Entry</label>
                            <textarea
                                value={form.data.body}
                                onChange={(event) => form.setData('body', event.target.value)}
                                placeholder="What did you work on?"
                                rows={4}
                                className="border-input bg-background flex w-full rounded-xl border px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            />
                            {form.errors.body && <p className="text-xs font-medium text-destructive">{form.errors.body}</p>}
                        </div>
                        <MobileInput
                            label="Minutes"
                            type="number"
                            min={0}
                            step="1"
                            value={form.data.duration_minutes}
                            onChange={(event) => form.setData('duration_minutes', event.target.value)}
                            placeholder="Optional"
                        />
                        <MobileButton type="submit" isLoading={form.processing} className="w-full gap-2">
                            <Plus className="h-4 w-4" />
                            Save Entry
                        </MobileButton>
                    </form>
                </MobileCard>

                <MobileCard title="Search" subtitle="Filter work log entries">
                    <form onSubmit={handleSearch} className="space-y-3">
                        <MobileInput
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search entries"
                        />
                        <MobileButton type="submit" variant="outline" className="w-full gap-2">
                            <Search className="h-4 w-4" />
                            Search
                        </MobileButton>
                    </form>
                </MobileCard>

                <div className="flex gap-2">
                    <MobileButton type="button" variant="outline" size="sm" className="flex-1 gap-2" onClick={() => exportData('csv')}>
                        <Download className="h-4 w-4" />
                        CSV
                    </MobileButton>
                    <MobileButton type="button" variant="outline" size="sm" className="flex-1 gap-2" onClick={() => exportData('json')}>
                        <Download className="h-4 w-4" />
                        JSON
                    </MobileButton>
                </div>

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">Recent Entries</h2>
                    {entries.data.length === 0 ? (
                        <MobileCard>
                            <p className="py-4 text-center text-sm text-muted-foreground">No work log entries found.</p>
                        </MobileCard>
                    ) : (
                        entries.data.map((entry) => (
                            <MobileCard key={entry.id}>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                            {entry.source}
                                        </span>
                                        <span className="text-xs text-muted-foreground">{formatDuration(entry.duration_seconds)}</span>
                                    </div>
                                    <p className="text-sm leading-6">{entry.body}</p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>{entry.project?.name ?? 'No project'}</span>
                                        <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </MobileCard>
                        ))
                    )}
                </section>
            </div>
        </MobileShell>
    );
}