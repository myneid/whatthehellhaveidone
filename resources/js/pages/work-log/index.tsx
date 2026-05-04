import { Head, Link, router, useForm } from '@inertiajs/react';
import { Download, Pencil, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import * as workLog from '@/routes/work-log';
import { exportMethod as workLogExport } from '@/routes/work-log';
import type { BreadcrumbItem } from '@/types';
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

function CreateEntryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const form = useForm({ body: '', duration_minutes: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.transform((data) => ({
            body: data.body,
            duration_seconds: data.duration_minutes ? Math.round(Number(data.duration_minutes) * 60) : null,
        })).post(workLog.store().url, {
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Work Log Entry</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="entry-body">Entry</Label>
                        <textarea
                            id="entry-body"
                            value={form.data.body}
                            onChange={(e) => form.setData('body', e.target.value)}
                            placeholder="What did you work on? Use #project-name to link to a project."
                            rows={4}
                            autoFocus
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Use hashtags like #client-portal to auto-link projects.</p>
                        {form.errors.body && <p className="text-destructive text-sm">{form.errors.body}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="entry-duration">Time spent (minutes)</Label>
                        <Input
                            id="entry-duration"
                            type="number"
                            min={0}
                            step="1"
                            value={form.data.duration_minutes}
                            onChange={(e) => form.setData('duration_minutes', e.target.value)}
                            placeholder="Optional"
                        />
                        {form.errors.duration_seconds && <p className="text-destructive text-sm">{form.errors.duration_seconds}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Save Entry
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditEntryDialog({ entry, onClose }: { entry: WorkLogEntry | null; onClose: () => void }) {
    const form = useForm({ body: '', duration_minutes: '' });

    useEffect(() => {
        if (!entry) {
            return;
        }

        form.setData({
            body: entry.body,
            duration_minutes: entry.duration_seconds ? Math.round(entry.duration_seconds / 60).toString() : '',
        });
    }, [entry]);

    function submit(e: React.FormEvent) {
        e.preventDefault();
        if (!entry) {
            return;
        }

        form.transform((data) => ({
            body: data.body,
            duration_seconds: data.duration_minutes ? Math.round(Number(data.duration_minutes) * 60) : null,
        })).put(workLog.update(entry.id).url, {
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    }

    return (
        <Dialog open={Boolean(entry)} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Work Log Entry</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="edit-entry-body">Entry</Label>
                        <textarea
                            id="edit-entry-body"
                            value={form.data.body}
                            onChange={(e) => form.setData('body', e.target.value)}
                            rows={4}
                            autoFocus
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Hashtags are re-parsed when you save this entry.</p>
                        {form.errors.body && <p className="text-destructive text-sm">{form.errors.body}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="edit-entry-duration">Time spent (minutes)</Label>
                        <Input
                            id="edit-entry-duration"
                            type="number"
                            min={0}
                            step="1"
                            value={form.data.duration_minutes}
                            onChange={(e) => form.setData('duration_minutes', e.target.value)}
                            placeholder="Optional"
                        />
                        {form.errors.duration_seconds && <p className="text-destructive text-sm">{form.errors.duration_seconds}</p>}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EntrySourceBadge({ source }: { source: string }) {
    const colors: Record<string, string> = {
        manual: 'bg-blue-100 text-blue-800',
        api: 'bg-purple-100 text-purple-800',
        card_activity: 'bg-green-100 text-green-800',
        github: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[source] ?? 'bg-muted text-muted-foreground'}`}>
            {source}
        </span>
    );
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export default function WorkLogIndex({ entries, filters }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const [editingEntry, setEditingEntry] = useState<WorkLogEntry | null>(null);
    const [search, setSearch] = useState(filters.search ?? '');

    function applyFilters(newFilters: Partial<Filters>) {
        router.get(workLog.index().url, { ...filters, ...newFilters }, { preserveState: true, replace: true });
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        applyFilters({ search });
    }

    function exportData(format: 'json' | 'csv') {
        window.location.href = workLogExport.url({ format, date_from: filters.date_from, date_to: filters.date_to });
    }

    return (
        <>
            <Head title="Work Log" />

            <div className="flex h-full flex-1 flex-col gap-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Work Log</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => exportData('csv')}>
                            <Download className="mr-1 h-4 w-4" />
                            CSV
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => exportData('json')}>
                            <Download className="mr-1 h-4 w-4" />
                            JSON
                        </Button>
                        <Button size="sm" onClick={() => setShowCreate(true)}>
                            <Plus className="mr-1 h-4 w-4" />
                            New Entry
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search entries..."
                                className="pl-9"
                            />
                        </div>
                        <Button type="submit" variant="outline" size="default">
                            Search
                        </Button>
                    </form>

                    <div className="flex gap-2">
                        <Input
                            type="date"
                            value={filters.date_from ?? ''}
                            onChange={(e) => applyFilters({ date_from: e.target.value || undefined })}
                            className="w-40"
                            placeholder="From"
                        />
                        <Input
                            type="date"
                            value={filters.date_to ?? ''}
                            onChange={(e) => applyFilters({ date_to: e.target.value || undefined })}
                            className="w-40"
                            placeholder="To"
                        />
                    </div>

                    <select
                        value={filters.source ?? ''}
                        onChange={(e) => applyFilters({ source: e.target.value || undefined })}
                        className="border-input bg-background rounded-md border px-3 py-2 text-sm"
                    >
                        <option value="">All sources</option>
                        <option value="manual">Manual</option>
                        <option value="api">API</option>
                        <option value="card_activity">Card Activity</option>
                        <option value="github">GitHub</option>
                    </select>

                    {Object.values(filters).some(Boolean) && (
                        <Button variant="ghost" size="sm" onClick={() => router.get(workLog.index().url)}>
                            Clear filters
                        </Button>
                    )}
                </div>

                {/* Entries */}
                <div className="flex-1 space-y-2">
                    {entries.data.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-12 text-center">
                            <p className="text-muted-foreground">No work log entries found.</p>
                        </div>
                    ) : (
                        <>
                            {entries.data.map((entry) => (
                                <div key={entry.id} className="rounded-lg border p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm whitespace-pre-wrap">{entry.body}</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <EntrySourceBadge source={entry.source} />
                                                {entry.project && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {entry.project.name}
                                                    </span>
                                                )}
                                                {entry.board && (
                                                    <span className="text-xs text-muted-foreground">
                                                        / {entry.board.name}
                                                    </span>
                                                )}
                                                {entry.card && (
                                                    <span className="text-xs text-muted-foreground">
                                                        / {entry.card.title}
                                                    </span>
                                                )}
                                                {entry.duration_seconds && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatDuration(entry.duration_seconds)}
                                                    </span>
                                                )}
                                                {entry.hashtags?.length > 0 && (
                                                    <div className="flex gap-1">
                                                        {entry.hashtags.map((tag) => (
                                                            <span key={tag} className="text-xs text-primary">
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <time className="shrink-0 text-xs text-muted-foreground">
                                            {new Date(entry.created_at).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </time>
                                        <Button size="icon" variant="ghost" onClick={() => setEditingEntry(entry)}>
                                            <Pencil className="h-4 w-4" />
                                            <span className="sr-only">Edit entry</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {/* Pagination */}
                            {entries.last_page > 1 && (
                                <div className="flex items-center justify-center gap-2 pt-4">
                                    {entries.links.map((link, i) => (
                                        link.url ? (
                                            <Link
                                                key={i}
                                                href={link.url}
                                                className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ) : (
                                            <span
                                                key={i}
                                                className="rounded px-3 py-1 text-sm text-muted-foreground"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            <CreateEntryDialog open={showCreate} onClose={() => setShowCreate(false)} />
            <EditEntryDialog entry={editingEntry} onClose={() => setEditingEntry(null)} />
        </>
    );
}

WorkLogIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Work Log', href: workLog.index().url },
    ] as BreadcrumbItem[],
};
