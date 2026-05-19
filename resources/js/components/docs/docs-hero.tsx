import type { ComponentType, ReactNode } from 'react';
import { DocsStatBar } from '@/components/docs/docs-stat-bar';

type DocsStat = {
    label: string;
    value: string;
};

type DocsHeroProps = {
    eyebrow: string;
    eyebrowIcon?: ComponentType<{ className?: string }>;
    title: ReactNode;
    description: string;
    actions?: ReactNode;
    stats?: DocsStat[];
};

export function DocsHero({
    eyebrow,
    eyebrowIcon: EyebrowIcon,
    title,
    description,
    actions,
    stats,
}: DocsHeroProps) {
    return (
        <header className="relative space-y-8 pb-4 pt-2 sm:pb-6">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl space-y-5">
                    <p className="docs-eyebrow">
                        {EyebrowIcon && <EyebrowIcon className="size-3.5" />}
                        {eyebrow}
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
                    <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                    {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
                </div>

                {stats && stats.length > 0 && (
                    <DocsStatBar stats={stats} className="sm:max-w-sm lg:w-auto" />
                )}
            </div>
        </header>
    );
}
