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
        <section className="space-y-4 pt-4">
            <h2 className="text-xl font-bold tracking-tight">Next steps</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {steps.map((step) => (
                    <Link key={step.href} href={step.href} className="group block">
                        <Card className="h-full hover:-translate-y-0.5 hover:border-primary hover:shadow-brand">
                            <CardHeader className="gap-3">
                                <div className="flex items-start justify-between gap-3">
                                    {step.icon && (
                                        <step.icon className="size-5 shrink-0 text-primary transition-brand group-hover:scale-110" />
                                    )}
                                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-brand group-hover:translate-x-0.5 group-hover:text-primary" />
                                </div>
                                <CardTitle className="text-base transition-brand group-hover:text-primary">
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
