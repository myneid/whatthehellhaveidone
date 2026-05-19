import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type DocsCodeBlockProps = {
    children: ReactNode;
    className?: string;
};

export function DocsCodeBlock({ children, className }: DocsCodeBlockProps) {
    return (
        <pre
            className={cn(
                'overflow-x-auto rounded-xl border border-border bg-muted/60 p-4 text-sm leading-relaxed font-mono text-foreground',
                className,
            )}
        >
            {children}
        </pre>
    );
}
