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
        <Card className="border-border bg-muted/30">
            <CardContent className="flex flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="font-semibold text-foreground">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
                <Button variant="brand" asChild className="shrink-0">
                    <Link href={actionHref}>{actionLabel}</Link>
                </Button>
            </CardContent>
        </Card>
    );
}
