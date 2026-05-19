import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion } from 'motion/react';
import * as React from 'react';

import { springSoft, springTap } from '@/lib/motion';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
    {
        variants: {
            variant: {
                default:
                    'bg-primary text-primary-foreground shadow-brand-sm hover:bg-primary/90 hover:shadow-brand-hover',
                brand:
                    'btn-brand bg-brand-red text-brand-cream shadow-brand-sm hover:bg-brand-red/90 hover:shadow-brand-yellow-hover focus-visible:ring-brand-red/40',
                destructive:
                    'bg-destructive text-white shadow-brand-sm hover:bg-destructive/90 hover:shadow-brand-hover focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
                outline:
                    'border-2 border-border bg-background shadow-brand-sm hover:border-brand-yellow-text hover:bg-brand-yellow/10 hover:text-brand-yellow-text hover:shadow-brand-hover',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-brand-sm hover:bg-secondary/90 hover:shadow-brand-hover',
                ghost: 'hover:bg-accent hover:text-accent-foreground active:bg-accent/80',
                link: 'text-foreground underline-offset-4 hover:text-brand-yellow-text hover:underline hover:decoration-brand-yellow-text hover:decoration-2 active:text-brand-yellow-text/80',
            },
            size: {
                default: 'h-9 px-4 py-2 has-[>svg]:px-3',
                sm: 'h-8 rounded-xl px-3 has-[>svg]:px-2.5',
                lg: 'h-10 rounded-xl px-6 has-[>svg]:px-4',
                icon: 'size-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

type ButtonProps = Omit<
    React.ComponentProps<'button'>,
    'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'
> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
    const classes = cn(buttonVariants({ variant, size, className }));

    if (asChild) {
        const motionClass =
            variant !== 'link' && variant !== 'ghost' ? 'btn-smooth' : 'transition-smooth-colors';

        return (
            <Slot
                data-slot="button"
                className={cn(classes, motionClass)}
                {...props}
            />
        );
    }

    if (variant === 'link' || variant === 'ghost') {
        return (
            <button
                type="button"
                data-slot="button"
                className={cn(classes, 'transition-smooth')}
                {...props}
            />
        );
    }

    return (
        <motion.button
            type="button"
            data-slot="button"
            className={cn(classes, 'transition-smooth-colors')}
            whileHover={{ y: -1 }}
            whileTap={{ y: 0, scale: 0.985 }}
            transition={{
                y: springSoft,
                scale: springTap,
            }}
            {...props}
        />
    );
}

export { Button, buttonVariants };
