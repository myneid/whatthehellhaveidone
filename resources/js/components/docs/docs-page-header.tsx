import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

type DocsPageHeaderProps = {
    badge?: string;
    title: string;
    description?: string;
    children?: ReactNode;
};

export function DocsPageHeader({
    badge,
    title,
    description,
    children,
}: DocsPageHeaderProps) {
    return (
        <header className="space-y-4 border-b-2 border-border pb-8">
            {badge && (
                <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                    {badge}
                </Badge>
            )}
            <div className="space-y-3">
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
                {description && (
                    <p className="max-w-2xl text-lg text-muted-foreground">{description}</p>
                )}
            </div>
            {children}
        </header>
    );
}
