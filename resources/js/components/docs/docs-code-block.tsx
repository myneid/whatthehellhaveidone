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
                'overflow-x-auto rounded-2xl border border-docs-border bg-docs-surface-elevated p-4 text-sm leading-relaxed font-mono text-foreground backdrop-blur-xl',
                className,
            )}
        >
            {children}
        </pre>
    );
}
