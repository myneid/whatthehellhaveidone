import { cn } from '@/lib/utils';

type Props = {
    className?: string;
};

export default function AppLogo({ className }: Props) {
    return (
        <img
            src="/whatthehellhaveidone.png"
            alt="What the HELL have i DONE"
            className={cn(
                'h-12 w-auto rounded-full object-contain md:h-14',
                className,
            )}
        />
    );
}
