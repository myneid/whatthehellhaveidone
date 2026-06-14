import React from 'react';
import { MobileLayout } from './MobileLayout';
import { MobileNav } from './MobileNav';
import { usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';

interface MobileShellProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    className?: string;
}

export function MobileShell({ children, header, className }: MobileShellProps) {
    const { url } = usePage();

    return (
        <MobileLayout 
            header={header} 
            showNav={false}
            className={cn("", className)}
        >
            {children}
            <MobileNav currentRoute={url} />
        </MobileLayout>
    );
}
