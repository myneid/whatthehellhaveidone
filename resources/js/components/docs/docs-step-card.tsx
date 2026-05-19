import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type DocsStepCardProps = {
    step: number;
    title: string;
    icon: LucideIcon;
    children: ReactNode;
    isLast?: boolean;
    highlights?: string[];
};

export function DocsStepCard({
    step,
    title,
    icon: Icon,
    children,
    isLast = false,
    highlights = [],
}: DocsStepCardProps) {
    return (
        <div className="relative flex gap-5 sm:gap-6">
            <div className="flex flex-col items-center">
                <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-2xl border-2 border-border bg-card shadow-brand-sm">
                    <Icon className="size-5 text-foreground" aria-hidden />
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {step}
                    </span>
                </span>
                {!isLast && (
                    <span
                        className="mt-2 w-0.5 flex-1 min-h-8 bg-border"
                        aria-hidden
                    />
                )}
            </div>

            <Card className={cn('hover-docs-interactive mb-8 min-w-0 flex-1', isLast && 'mb-0')}>
                <CardHeader className="gap-2 pb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-brand-yellow-text">
                        Step {step}
                    </p>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-muted-foreground [&_a]:hover-docs-link [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-foreground [&_li]:leading-relaxed [&_p]:leading-relaxed">
                    {children}
                    {highlights.length > 0 && (
                        <ul className="flex flex-wrap gap-2 pt-1">
                            {highlights.map((item) => (
                                <li
                                    key={item}
                                    className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
