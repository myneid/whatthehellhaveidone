import React from 'react';
import { cn } from '@/lib/utils';

interface MobileCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
    className?: string;
}

export function MobileCard({
    title,
    subtitle,
    children,
    className,
    ...props
}: MobileCardProps) {
    return (
        <div 
            className={cn(
                "bg-card text-card-foreground rounded-2xl border shadow-sm overflow-hidden",
                className
            )}
            {...props}
        >
            {(title || subtitle) && (
                <div className="px-4 py-3 border-b bg-muted/30">
                    {title && <h3 className="font-semibold text-sm">{title}</h3>}
                    {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
                </div>
            )}
            <div className="p-4">
                {children}
            </div>
        </div>
    );
}
