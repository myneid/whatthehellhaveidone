import type { ComponentType, ReactNode } from 'react';

type DocsSectionHeaderProps = {
    icon?: ComponentType<{ className?: string }>;
    title: string;
    description?: ReactNode;
};

export function DocsSectionHeader({
    icon: Icon,
    title,
    description,
}: DocsSectionHeaderProps) {
    return (
        <div className="space-y-1">
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight">
                {Icon && <Icon className="size-5 text-muted-foreground" />}
                {title}
            </h2>
            {description && (
                <div className="text-sm text-muted-foreground [&_a]:hover-docs-link [&_a]:font-medium [&_a]:text-foreground">
                    {description}
                </div>
            )}
        </div>
    );
}
