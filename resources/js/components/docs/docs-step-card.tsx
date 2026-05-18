import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DocsStepCardProps = {
    step: number;
    title: string;
    children: ReactNode;
};

export function DocsStepCard({ step, title, children }: DocsStepCardProps) {
    return (
        <Card className="overflow-hidden hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-brand">
            <CardHeader className="flex-row items-start gap-4 space-y-0 pb-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-brand-sm">
                    {step}
                </span>
                <CardTitle className="pt-1.5 text-xl">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:transition-brand [&_a:hover]:text-primary/80 [&_a:hover]:underline [&_li]:ml-4 [&_li]:list-disc [&_p]:leading-relaxed [&_ul]:space-y-1">
                {children}
            </CardContent>
        </Card>
    );
}
