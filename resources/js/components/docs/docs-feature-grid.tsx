import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type DocsFeature = {
    icon: LucideIcon;
    title: string;
    description: string;
};

type DocsFeatureGridProps = {
    features: DocsFeature[];
    columns?: 2 | 3;
};

export function DocsFeatureGrid({ features, columns = 3 }: DocsFeatureGridProps) {
    return (
        <div
            className={cn(
                'grid gap-3',
                columns === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3',
            )}
        >
            {features.map((feature) => (
                <Card
                    key={feature.title}
                    className="hover-docs-interactive border-border bg-card/80"
                >
                    <CardContent className="flex gap-3 px-4 py-4">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
                            <feature.icon className="size-4 text-foreground" aria-hidden />
                        </div>
                        <div className="min-w-0 space-y-1">
                            <p className="text-sm font-semibold text-foreground">
                                {feature.title}
                            </p>
                            <p className="text-xs leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
