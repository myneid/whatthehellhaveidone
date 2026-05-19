import { CheckCircle2, XCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type IncludedExcludedItem = {
    icon?: LucideIcon;
    title: string;
    description?: string;
};

type DocsIncludedExcludedProps = {
    included: IncludedExcludedItem[];
    excluded: IncludedExcludedItem[];
};

export function DocsIncludedExcluded({ included, excluded }: DocsIncludedExcludedProps) {
    return (
        <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border">
                <CardHeader className="gap-2 pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle2 className="size-5 text-green-600 dark:text-green-500" />
                        What gets imported
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {included.map((item) => (
                        <div key={item.title} className="flex gap-3">
                            {item.icon && (
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
                                    <item.icon className="size-4 text-foreground" aria-hidden />
                                </div>
                            )}
                            <div className="min-w-0 space-y-0.5">
                                <p className="text-sm font-semibold text-foreground">
                                    {item.title}
                                </p>
                                {item.description && (
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-border">
                <CardHeader className="gap-2 pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <XCircle className="size-5 text-muted-foreground" />
                        What is not imported
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {excluded.map((item) => (
                        <div key={item.title} className="flex gap-3">
                            {item.icon && (
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
                                    <item.icon className="size-4 text-muted-foreground" aria-hidden />
                                </div>
                            )}
                            <div className="min-w-0 space-y-0.5">
                                <p className="text-sm font-semibold text-foreground">
                                    {item.title}
                                </p>
                                {item.description && (
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
