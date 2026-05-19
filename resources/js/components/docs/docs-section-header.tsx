import type { ComponentType } from 'react';

type DocsSectionHeaderProps = {
    icon?: ComponentType<{ className?: string }>;
    title: string;
    description?: string;
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
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    );
}
