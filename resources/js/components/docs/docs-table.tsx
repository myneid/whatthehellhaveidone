import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DocsTableProps = {
    headers: string[];
    rows: string[][];
    className?: string;
};

export function DocsTable({ headers, rows, className }: DocsTableProps) {
    return (
        <div className={cn('not-prose my-6 overflow-x-auto rounded-lg border', className)}>
            <table className="w-full min-w-[320px] text-sm">
                <thead>
                    <tr className="border-b bg-muted/50">
                        {headers.map((header, index) => (
                            <th
                                key={`${header}-${index}`}
                                className={cn(
                                    'px-4 py-3 text-left font-medium',
                                    header
                                        ? 'text-foreground'
                                        : 'w-[140px] text-muted-foreground',
                                )}
                            >
                                {header || '\u00a0'}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {rows.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className="transition-colors hover:bg-muted/30"
                        >
                            {row.map((cell, cellIndex) => (
                                <td
                                    key={cellIndex}
                                    className={cn(
                                        'px-4 py-3 align-top',
                                        cellIndex === 0
                                            ? 'font-medium text-foreground'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function DocsCallout({ children }: { children: ReactNode }) {
    return (
        <div className="not-prose my-6 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-muted-foreground">
            {children}
        </div>
    );
}
