import React from 'react';
import { cn } from '@/lib/utils';

interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function MobileInput({
    className,
    label,
    error,
    helperText,
    ...props
}: MobileInputProps) {
    return (
        <div className={cn("space-y-1.5 w-full", className)}>
            {label && (
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
            )}
            <input
                className={cn(
                    "flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    error ? "border-destructive focus-visible:ring-destructive" : ""
                )}
                {...props}
            />
            {error && (
                <p className="text-xs text-destructive font-medium">
                    {error}
                </p>
            )}
            {helperText && !error && (
                <p className="text-xs text-muted-foreground">
                    {helperText}
                </p>
            )}
        </div>
    );
}
