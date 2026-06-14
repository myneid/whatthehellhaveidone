import React from 'react';
import { cn } from '@/lib/utils';

interface MobileTabButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ElementType;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}

export function MobileTabButton({
    icon: Icon,
    label,
    isActive = false,
    className,
    onClick,
    ...props
}: MobileTabButtonProps) {
    return (
        <button
            className={cn(
                "flex flex-col items-center justify-center w-full py-2 transition-colors",
                isActive ? "text-brand-red" : "text-muted-foreground",
                className
            )}
            onClick={onClick}
            {...props}
        >
            <Icon className={cn("size-6", isActive ? "fill-brand-red/20" : "")} />
            <span className="text-[10px] font-medium mt-1">{label}</span>
        </button>
    );
}
