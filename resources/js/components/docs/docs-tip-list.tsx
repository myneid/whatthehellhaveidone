import { Keyboard } from 'lucide-react';
import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

type DocsTip = {
    title: string;
    description: ReactNode;
};

type DocsTipListProps = {
    tips: DocsTip[];
};

export function DocsTipList({ tips }: DocsTipListProps) {
    return (
        <div className="space-y-3">
            {tips.map((tip) => (
                <Card key={tip.title} className="border-border bg-muted/20">
                    <CardContent className="flex gap-3 px-4 py-4">
                        <Keyboard
                            className="mt-0.5 size-4 shrink-0 text-brand-yellow-text"
                            aria-hidden
                        />
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">{tip.title}</p>
                            <p className="text-sm leading-relaxed text-muted-foreground [&_kbd]:rounded-md [&_kbd]:border [&_kbd]:border-border [&_kbd]:bg-card [&_kbd]:px-1.5 [&_kbd]:py-0.5 [&_kbd]:font-mono [&_kbd]:text-xs [&_kbd]:text-foreground">
                                {tip.description}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
