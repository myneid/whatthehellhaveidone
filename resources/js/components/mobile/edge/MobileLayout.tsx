import React from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    className?: string;
    showNav?: boolean;
}

export function MobileLayout({ 
    children, 
    header, 
    className, 
    showNav = true 
}: MobileLayoutProps) {
    return (
        <div className={cn(
            "flex flex-col min-h-screen bg-background text-foreground pb-safe",
            className
        )}>
            {header && (
                <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md px-4 py-3">
                    {header}
                </header>
            )}
            
            <main className="flex-1 w-full max-w-screen-sm mx-auto px-4 pt-4">
                {children}
            </main>
        </div>
    );
}
