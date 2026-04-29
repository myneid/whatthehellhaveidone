import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import * as boardRoutes from '@/routes/boards';
import * as projectRoutes from '@/routes/projects';
import type { BreadcrumbItem } from '@/types';
import type { Board, BoardList, Card, Label } from '@/types/app';

type Props = {
    board: Board & { lists: BoardList[] };
    cards: Card[];
};

const PRIORITY_COLORS: Record<string, string> = {
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
};

export default function BoardReport({ board, cards }: Props) {
    const [selectedLabels, setSelectedLabels] = useState<number[]>([]);
    const [selectedList, setSelectedList] = useState<number | null>(null);
    const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
    const [showCompleted, setShowCompleted] = useState<'all' | 'open' | 'done'>('all');

    const labels: Label[] = board.labels ?? [];
    const lists: BoardList[] = board.lists ?? [];

    const filtered = useMemo(() => {
        return cards.filter((card) => {
            if (selectedLabels.length > 0) {
                const ids = (card.labels ?? []).map((l) => l.id);
                if (!selectedLabels.every((id) => ids.includes(id))) return false;
            }
            if (selectedList !== null && card.list_id !== selectedList) return false;
            if (selectedPriority && card.priority !== selectedPriority) return false;
            if (showCompleted === 'open' && card.completed_at) return false;
            if (showCompleted === 'done' && !card.completed_at) return false;
            return true;
        });
    }, [cards, selectedLabels, selectedList, selectedPriority, showCompleted]);

    function toggleLabel(id: number) {
        setSelectedLabels((prev) => prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]);
    }

    return (
        <>
            <Head title={`${board.name} — Report`} />

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{board.name} — Cards Report</h1>
                    <Link href={boardRoutes.show(board).url}>
                        <Button variant="outline" size="sm">← Back to Board</Button>
                    </Link>
                </div>

                {/* Filters */}
                <div className="rounded-lg border bg-card p-4 space-y-4">
                    <p className="text-sm font-medium">Filters</p>

                    <div className="flex flex-wrap gap-4">
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Status</p>
                            <div className="flex gap-1">
                                {(['all', 'open', 'done'] as const).map((v) => (
                                    <Button key={v} size="sm" variant={showCompleted === v ? 'default' : 'outline'} className="h-7 text-xs capitalize" onClick={() => setShowCompleted(v)}>
                                        {v}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Column</p>
                            <div className="flex flex-wrap gap-1">
                                <Button size="sm" variant={selectedList === null ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setSelectedList(null)}>All</Button>
                                {lists.map((list) => (
                                    <Button key={list.id} size="sm" variant={selectedList === list.id ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setSelectedList(list.id)}>
                                        {list.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Priority</p>
                            <div className="flex gap-1">
                                <Button size="sm" variant={selectedPriority === null ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setSelectedPriority(null)}>All</Button>
                                {['low', 'medium', 'high', 'critical'].map((p) => (
                                    <Button key={p} size="sm" variant={selectedPriority === p ? 'default' : 'outline'} className="h-7 text-xs capitalize"
                                        onClick={() => setSelectedPriority(p === selectedPriority ? null : p)}>
                                        {p}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {labels.length > 0 && (
                        <div className="space-y-1">
                            <p className="text-xs text-muted-foreground">Labels</p>
                            <div className="flex flex-wrap gap-1.5">
                                {labels.map((label) => (
                                    <button key={label.id} type="button" onClick={() => toggleLabel(label.id)}
                                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white transition-opacity ${selectedLabels.includes(label.id) ? 'opacity-100 ring-2 ring-offset-1' : 'opacity-40 hover:opacity-70'}`}
                                        style={{ backgroundColor: label.color, ['--tw-ring-color' as string]: label.color }}>
                                        {label.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                        { label: 'Total', value: filtered.length },
                        { label: 'Open', value: filtered.filter((c) => !c.completed_at).length },
                        { label: 'Completed', value: filtered.filter((c) => !!c.completed_at).length },
                        { label: 'With Attachments', value: filtered.filter((c) => (c.attachments ?? []).length > 0).length },
                    ].map(({ label, value }) => (
                        <div key={label} className="rounded-lg border bg-card p-4 text-center">
                            <p className="text-2xl font-semibold">{value}</p>
                            <p className="text-xs text-muted-foreground">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Label breakdown */}
                {labels.length > 0 && (
                    <div className="rounded-lg border bg-card p-4">
                        <p className="mb-3 text-sm font-medium">Cards by Label</p>
                        <div className="flex flex-wrap gap-4">
                            {labels.map((label) => {
                                const count = filtered.filter((c) => (c.labels ?? []).some((l) => l.id === label.id)).length;
                                return (
                                    <div key={label.id} className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: label.color }} />
                                        <span className="text-sm">{label.name}</span>
                                        <span className="text-sm font-semibold">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Cards table */}
                <div className="rounded-lg border bg-card overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="border-b bg-muted/50">
                            <tr>
                                <th className="px-4 py-2.5 text-left font-medium">Card</th>
                                <th className="px-4 py-2.5 text-left font-medium">Labels</th>
                                <th className="px-4 py-2.5 text-left font-medium">Column</th>
                                <th className="px-4 py-2.5 text-left font-medium">Priority</th>
                                <th className="px-4 py-2.5 text-left font-medium">Status</th>
                                <th className="px-4 py-2.5 text-left font-medium">Files</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No cards match the current filters.</td>
                                </tr>
                            ) : filtered.map((card) => (
                                <tr key={card.id} className="hover:bg-muted/30">
                                    <td className="px-4 py-2.5 font-medium max-w-xs">
                                        <span className={card.completed_at ? 'text-muted-foreground line-through' : ''}>{card.title}</span>
                                    </td>
                                    <td className="px-4 py-2.5">
                                        <div className="flex flex-wrap gap-1">
                                            {(card.labels ?? []).map((label) => (
                                                <span key={label.id} className="rounded-full px-2 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: label.color }}>
                                                    {label.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-muted-foreground">{card.list?.name ?? '—'}</td>
                                    <td className="px-4 py-2.5">
                                        {card.priority && card.priority !== 'none' ? (
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_COLORS[card.priority] ?? ''}`}>
                                                {card.priority}
                                            </span>
                                        ) : '—'}
                                    </td>
                                    <td className="px-4 py-2.5">
                                        {card.completed_at
                                            ? <span className="text-xs font-medium text-green-600">Done</span>
                                            : <span className="text-xs font-medium text-blue-600">Open</span>}
                                    </td>
                                    <td className="px-4 py-2.5 text-muted-foreground text-xs">
                                        {(card.attachments ?? []).length > 0
                                            ? `${card.attachments!.length} file${card.attachments!.length !== 1 ? 's' : ''}`
                                            : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

BoardReport.layout = (props: Props): { breadcrumbs: BreadcrumbItem[] } => {
    const crumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard() }];
    if (props.board.project) {
        crumbs.push({ title: (props.board.project as any).name, href: projectRoutes.show(props.board.project as any).url });
    }
    crumbs.push({ title: props.board.name, href: boardRoutes.show(props.board).url });
    crumbs.push({ title: 'Report' });
    return { breadcrumbs: crumbs };
};
