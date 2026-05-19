import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { springReveal } from '@/lib/motion';
import { cn } from '@/lib/utils';

type DocsStepCardProps = {
    step: number;
    title: string;
    icon: LucideIcon;
    children: ReactNode;
    isLast?: boolean;
    active?: boolean;
    highlights?: string[];
};

export function DocsStepCard({
    step,
    title,
    icon: Icon,
    children,
    isLast = false,
    active = false,
    highlights = [],
}: DocsStepCardProps) {
    return (
        <motion.div
            className="relative flex gap-5 sm:gap-6"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                ...springReveal,
                delay: (step - 1) * 0.07,
            }}
        >
            <div className="flex flex-col items-center">
                <span
                    className={cn(
                        'docs-timeline-dot',
                        active && 'docs-timeline-dot-active',
                    )}
                >
                    <Icon className="size-5 text-foreground" aria-hidden />
                    <span
                        className={cn(
                            'absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full text-[10px] font-bold',
                            active
                                ? 'bg-brand-red text-white'
                                : 'bg-primary text-primary-foreground',
                        )}
                    >
                        {step}
                    </span>
                </span>
                {!isLast && (
                    <span className="docs-timeline-line mt-3 min-h-10 flex-1" aria-hidden />
                )}
            </div>

            <Card
                className={cn(
                    'docs-surface docs-surface-hover-glow hover-docs-interactive mb-10 min-w-0 flex-1 !border-0 !py-0 !shadow-none',
                    active && 'docs-surface-active lg:-mr-2 lg:scale-[1.01]',
                    isLast && 'mb-0',
                )}
            >
                <CardHeader className="gap-2 pb-3">
                    <p className="docs-eyebrow text-[10px] text-brand-accent">Step {step}</p>
                    <CardTitle className="text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 space-y-4 text-muted-foreground [&_a]:hover-docs-link [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground [&_strong]:font-semibold [&_strong]:text-foreground [&_a]:font-medium [&_a]:text-foreground [&_li]:leading-relaxed [&_p]:leading-relaxed">
                    {children}
                    {highlights.length > 0 && (
                        <ul className="flex flex-wrap gap-2 pt-1">
                            {highlights.map((item) => (
                                <li
                                    key={item}
                                    className="rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
