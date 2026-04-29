import { Head, router } from '@inertiajs/react';
import { CheckCircle, Clock, Loader2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import * as boardRoutes from '@/routes/boards';
import * as projectRoutes from '@/routes/projects';
import type { BreadcrumbItem } from '@/types';
import type { Board } from '@/types/app';

type TrelloImport = {
    id: number;
    board_id: number;
    source_board_name: string | null;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    filename: string;
    summary: {
        lists?: number;
        cards?: number;
        labels?: number;
        members?: number;
    } | null;
    errors: string[] | null;
    warnings: string[] | null;
    error_message: string | null;
    started_at: string | null;
    completed_at: string | null;
};

type Props = {
    board: Board;
    import: TrelloImport;
};

const STATUS_ICONS = {
    pending: <Clock className="h-8 w-8 text-yellow-500" />,
    processing: <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />,
    completed: <CheckCircle className="h-8 w-8 text-green-500" />,
    failed: <XCircle className="h-8 w-8 text-destructive" />,
};

const STATUS_LABELS = {
    pending: 'Queued',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
};

export default function BoardImportStatus({ board, import: importRecord }: Props) {
    const [status, setStatus] = useState(importRecord.status);
    const isTerminal = status === 'completed' || status === 'failed';

    useEffect(() => {
        if (isTerminal) return;
        const interval = setInterval(() => {
            router.reload({ only: ['import'], onSuccess: (page) => {
                const updated = (page.props as Props).import;
                setStatus(updated.status);
            }});
        }, 3000);
        return () => clearInterval(interval);
    }, [isTerminal]);

    return (
        <>
            <Head title={`Trello Import – ${board.name}`} />

            <div className="mx-auto max-w-xl px-4 py-12">
                <div className="rounded-xl border bg-card p-8 shadow-sm">
                    <div className="flex flex-col items-center gap-4 text-center">
                        {STATUS_ICONS[status]}
                        <div>
                            <h1 className="text-xl font-bold">{STATUS_LABELS[status]}</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Importing <strong>{importRecord.source_board_name ?? importRecord.filename}</strong> into{' '}
                                <strong>{board.name}</strong>
                            </p>
                        </div>
                    </div>

                    {status === 'completed' && importRecord.summary && (
                        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {Object.entries(importRecord.summary).map(([key, val]) => (
                                <div key={key} className="rounded-lg border bg-muted/40 p-3 text-center">
                                    <p className="text-2xl font-bold">{val}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{key}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {status === 'failed' && importRecord.error_message && (
                        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4">
                            <p className="text-sm font-medium text-destructive">Error</p>
                            <p className="mt-1 text-sm text-destructive/80">{importRecord.error_message}</p>
                        </div>
                    )}

                    {importRecord.warnings && importRecord.warnings.length > 0 && (
                        <div className="mt-6 rounded-lg border border-yellow-300/30 bg-yellow-50/10 p-4">
                            <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                {importRecord.warnings.length} warning{importRecord.warnings.length !== 1 ? 's' : ''}
                            </p>
                            <ul className="mt-2 space-y-1">
                                {importRecord.warnings.map((w, i) => (
                                    <li key={i} className="text-xs text-muted-foreground">{w}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {!isTerminal && (
                        <p className="mt-6 text-center text-xs text-muted-foreground">
                            This page refreshes automatically every few seconds…
                        </p>
                    )}

                    {isTerminal && (
                        <div className="mt-8 flex justify-center">
                            <Button asChild>
                                <a href={boardRoutes.show(board).url}>Go to Board</a>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

BoardImportStatus.layout = (props: Props): { breadcrumbs: BreadcrumbItem[] } => {
    const crumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: dashboard() }];
    if (props.board.project) {
        crumbs.push({ title: props.board.project.name, href: projectRoutes.show(props.board.project).url });
    }
    crumbs.push({ title: props.board.name, href: boardRoutes.show(props.board).url });
    crumbs.push({ title: 'Import Status', href: '' });
    return { breadcrumbs: crumbs };
};
