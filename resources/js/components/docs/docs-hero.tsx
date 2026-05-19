import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { DocsStatBar } from '@/components/docs/docs-stat-bar';

type DocsStat = {
    label: string;
    value: string;
};

type DocsHeroProps = {
    eyebrow: string;
    eyebrowIcon?: LucideIcon;
    title: string;
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
        <header className="overflow-hidden rounded-2xl border-2 border-border bg-card shadow-brand-sm">
            <div className="border-b border-border bg-muted/30 px-6 py-3 sm:px-8">
                <p className="flex items-center gap-2 text-sm font-semibold text-brand-yellow-text">
                    {EyebrowIcon && <EyebrowIcon className="size-4" />}
                    {eyebrow}
                </p>
            </div>

            <div className="flex flex-col gap-8 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl space-y-4">
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                        {title}
                    </h1>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                        {description}
                    </p>
                    {actions && (
                        <div className="flex flex-wrap gap-3 pt-1">{actions}</div>
                    )}
                </div>

                {stats && stats.length > 0 && (
                    <DocsStatBar stats={stats} className="sm:max-w-sm lg:w-auto" />
                )}
            </div>
        </header>
    );
}
