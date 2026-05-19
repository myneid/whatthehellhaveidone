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
        <Card className="overflow-hidden border-border">
            <CardContent className="divide-y divide-border p-0">
                {steps.map((step, index) => (
                    <div key={step.title} className="flex gap-4 px-5 py-4 sm:px-6">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                            {index + 1}
                        </span>
                        <div className="min-w-0 space-y-1">
                            <p className="text-sm font-semibold text-foreground">
                                {step.title}
                            </p>
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
