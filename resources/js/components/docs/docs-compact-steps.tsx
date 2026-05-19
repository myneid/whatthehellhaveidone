import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type DocsCompactStep = {
    title: string;
    description: ReactNode;
};

type DocsCompactStepsProps = {
    steps: DocsCompactStep[];
};

export function DocsCompactSteps({ steps }: DocsCompactStepsProps) {
    return (
        <Card className="docs-surface overflow-hidden !border-0 !py-0 !shadow-none">
            <CardContent className="divide-y divide-docs-border p-0">
                {steps.map((step, index) => (
                    <div key={step.title} className="flex gap-4 px-5 py-5 sm:px-6">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-brand-red/15 text-xs font-bold text-brand-red ring-1 ring-brand-red/25">
                            {index + 1}
                        </span>
                        <div className="min-w-0 space-y-1">
                            <p className="text-sm font-semibold text-foreground">{step.title}</p>
                            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:hover-docs-link [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_code]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-foreground">
                                {step.description}
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
