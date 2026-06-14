import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowLeft, Plus } from 'lucide-react';
import { MobileButton } from '@/components/mobile/edge/MobileButton';
import { MobileCard } from '@/components/mobile/edge/MobileCard';
import { MobileShell } from '@/components/mobile/edge/MobileShell';
import { dashboard } from '@/routes';
import type { Board } from '@/types/app';

interface MobileBoardProps {
    board: Board;
}

export default function MobileBoard({ board }: MobileBoardProps) {
    const lists = board.lists ?? [];

    return (
        <MobileShell
            header={
                <div className="flex items-center gap-3">
                    <Link href={dashboard().url} className="text-muted-foreground">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-xl font-bold">{board.name}</h1>
                </div>
            }
        >
            <div className="space-y-6 pb-24">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Lists</h2>
                    <MobileButton size="sm" variant="outline" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add List
                    </MobileButton>
                </div>

                <div className="space-y-4">
                    {lists.map((list) => {
                        const cards = list.cards ?? [];

                        return (
                        <div key={list.id} className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                    {list.name}
                                </h3>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                    {cards.length}
                                </span>
                            </div>
                            
                            <div className="space-y-2">
                                {cards.length === 0 ? (
                                    <div className="text-center py-4 border-2 border-dashed rounded-xl text-muted-foreground text-xs">
                                        No cards
                                    </div>
                                ) : (
                                    cards.map((card) => (
                                        <MobileCard key={card.id} className="cursor-pointer active:scale-[0.98] transition-transform">
                                            <div className="space-y-2">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className="font-medium text-sm leading-tight">{card.title}</h4>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {card.labels?.map((label) => (
                                                        <span 
                                                            key={label.id} 
                                                            className="h-2 w-4 rounded-full" 
                                                            style={{ backgroundColor: label.color }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </MobileCard>
                                    ))
                                )}
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </MobileShell>
    );
}
