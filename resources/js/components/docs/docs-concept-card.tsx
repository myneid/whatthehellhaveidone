import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type DocsConceptCardProps = {
    icon: LucideIcon;
    title: string;
    children: ReactNode;
    className?: string;
    highlights?: string[];
};

export function DocsConceptCard({
    icon: Icon,
    title,
    children,
    className,
    highlights = [],
}: DocsConceptCardProps) {
    return (
        <Card className={cn('hover-docs-interactive h-full', className)}>
            <CardHeader className="gap-3 pb-3">
                <div className="flex size-10 items-center justify-center rounded-xl border-2 border-border bg-muted/40">
                    <Icon className="size-5 text-foreground" aria-hidden />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground [&_a]:hover-docs-link [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-foreground [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:space-y-1.5">
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
    );
}
