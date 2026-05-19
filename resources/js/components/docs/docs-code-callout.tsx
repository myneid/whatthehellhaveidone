import type { ReactNode } from 'react';
import { DocsCodeBlock } from '@/components/docs/docs-code-block';

type DocsCodeCalloutProps = {
    code: string;
    children: ReactNode;
};

export function DocsCodeCallout({ code, children }: DocsCodeCalloutProps) {
    return (
        <div className="space-y-3">
            <DocsCodeBlock>{code}</DocsCodeBlock>
            <p className="text-sm leading-relaxed text-muted-foreground [&_a]:hover-docs-link [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-foreground">
                {children}
            </p>
        </div>
    );
}
