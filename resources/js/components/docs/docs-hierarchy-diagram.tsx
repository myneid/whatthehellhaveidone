import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type HierarchyLevel = {
    icon: LucideIcon;
    label: string;
    description: string;
};

type DocsHierarchyDiagramProps = {
    levels: HierarchyLevel[];
};

export function DocsHierarchyDiagram({ levels }: DocsHierarchyDiagramProps) {
    return (
        <div className="overflow-x-auto rounded-2xl border-2 border-border bg-muted/20 p-4 sm:p-6">
            <div className="flex min-w-max items-stretch gap-2 sm:gap-3">
                {levels.map((level, index) => (
                    <div key={level.label} className="flex items-center gap-2 sm:gap-3">
                        <div className="flex w-36 flex-col items-center rounded-xl border border-border bg-card px-3 py-4 text-center shadow-brand-sm sm:w-40">
                            <div className="mb-2 flex size-10 items-center justify-center rounded-xl border-2 border-border bg-muted/40">
                                <level.icon className="size-5 text-foreground" aria-hidden />
                            </div>
                            <p className="text-sm font-bold text-foreground">{level.label}</p>
                            <p className="mt-1 text-xs leading-snug text-muted-foreground">
                                {level.description}
                            </p>
                        </div>
                        {index < levels.length - 1 && (
                            <ChevronRight
                                className="size-5 shrink-0 text-muted-foreground"
                                aria-hidden
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
