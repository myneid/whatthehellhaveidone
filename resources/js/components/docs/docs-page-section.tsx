import type { ComponentType, ReactNode } from 'react';
import { DocsSectionHeader } from '@/components/docs/docs-section-header';

type DocsPageSectionProps = {
    icon?: ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    children: ReactNode;
};

export function DocsPageSection({
    icon,
    title,
    description,
    children,
}: DocsPageSectionProps) {
    return (
        <section className="space-y-4">
            <DocsSectionHeader icon={icon} title={title} description={description} />
            {children}
        </section>
    );
}
