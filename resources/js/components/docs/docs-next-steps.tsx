import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type DocsNextStep = {
    title: string;
    description: string;
    href: string;
    icon?: LucideIcon;
};

type DocsNextStepsProps = {
    steps: DocsNextStep[];
};

export function DocsNextSteps({ steps }: DocsNextStepsProps) {
    return (
        <section className="space-y-5 pt-6">
            <h2 className="text-2xl font-bold tracking-tight">Next steps</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {steps.map((step) => (
                    <Link key={step.href} href={step.href} className="group block">
                        <Card className="docs-surface docs-surface-hover-glow hover-docs-interactive h-full !border-0 !py-0 !shadow-none">
                            <CardHeader className="relative z-10 gap-3">
                                <div className="flex items-start justify-between gap-3">
                                    {step.icon && (
                                        <step.icon className="size-5 shrink-0 text-muted-foreground transition-brand group-hover:scale-110 group-hover-docs-accent" />
                                    )}
                                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-brand group-hover:translate-x-1.5 group-hover-docs-accent" />
                                </div>
                                <CardTitle className="text-base transition-brand group-hover-docs-bold">
                                    {step.title}
                                </CardTitle>
                                <CardDescription>{step.description}</CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}
