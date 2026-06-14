import React from 'react';
import { cn } from '@/lib/utils';

interface MobileBottomNavProps {
    children: React.ReactNode;
    className?: string;
}

export function MobileBottomNav({ children, className }: MobileBottomNavProps) {
    return (
        <nav 
            className={cn(
                "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around h-16 border-t bg-background/95 backdrop-blur-md px-2 pb-safe",
                className
            )}
        >
            {children}
        </nav>
    );
}
