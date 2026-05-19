import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type DocsCtaCardProps = {
    title: string;
    description: ReactNode;
    actionLabel: string;
    actionHref: string;
};

export function DocsCtaCard({
    title,
    description,
    actionLabel,
    actionHref,
}: DocsCtaCardProps) {
    return (
        <Card className="docs-surface docs-surface-active !border-0 !py-0 !shadow-none">
            <CardContent className="relative z-10 flex flex-col gap-4 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-lg font-semibold text-foreground">{title}</p>
                    <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground [&_a]:hover-docs-link [&_a]:font-medium [&_a]:text-foreground">
                        {description}
                    </div>
                </div>
                <Button variant="brand" asChild className="shrink-0">
                    <Link href={actionHref}>{actionLabel}</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
