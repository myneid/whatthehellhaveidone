import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-brand disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-brand-sm hover:bg-primary/90 hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:shadow-brand-sm",
        destructive:
          "bg-destructive text-white shadow-brand-sm hover:bg-destructive/90 hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:shadow-brand-sm focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-2 border-border bg-background shadow-brand-sm hover:border-primary hover:bg-primary/5 hover:text-primary hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:shadow-brand-sm",
        secondary:
          "bg-secondary text-secondary-foreground shadow-brand-sm hover:bg-secondary/90 hover:shadow-brand hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:shadow-brand-sm",
        ghost:
          "hover:bg-accent hover:text-accent-foreground active:scale-[0.98] active:bg-accent/80",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 active:text-primary/70",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-xl px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-xl px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
