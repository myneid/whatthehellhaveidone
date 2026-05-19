import { ChevronRight } from 'lucide-react';
import type { ComponentType } from 'react';

type HierarchyLevel = {
    icon: ComponentType<{ className?: string }>;
    label: string;
    description: string;
};

type DocsHierarchyDiagramProps = {
    levels: HierarchyLevel[];
};

export function DocsHierarchyDiagram({ levels }: DocsHierarchyDiagramProps) {
    return (
        <div className="docs-surface overflow-x-auto rounded-2xl p-4 sm:p-6">
            <div className="flex min-w-max items-stretch gap-2 sm:gap-3">
                {levels.map((level, index) => (
                    <div key={level.label} className="flex items-center gap-2 sm:gap-3">
                        <div className="flex w-36 flex-col items-center rounded-2xl bg-docs-surface-elevated px-3 py-4 text-center ring-1 ring-docs-border sm:w-40">
                            <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-docs-surface ring-1 ring-docs-border">
                                <level.icon className="size-5 text-foreground" aria-hidden />
                            </div>
                            <p className="text-sm font-bold text-foreground">{level.label}</p>
                            <p className="mt-1 text-xs leading-snug text-muted-foreground">
                                {level.description}
                            </p>
                        </div>
                        {index < levels.length - 1 && (
                            <ChevronRight
                                className="size-5 shrink-0 text-brand-accent/70"
                                aria-hidden
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
