import { Link } from '@inertiajs/react';
import { BookOpen, Settings } from 'lucide-react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

const footerIcons: Record<string, typeof BookOpen> = {
    Documentation: BookOpen,
    Settings: Settings,
};

export function NavFooter({ items }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <>
            {items.map((item) => {
                const Icon = footerIcons[item.title] ?? BookOpen;
                const href = toUrl(item.href);
                const active = isCurrentUrl(item.href);

                return (
                    <Link
                        key={item.title}
                        href={href}
                        prefetch
                        className={cn('sb-foot-row', active && 'text-sidebar-foreground')}
                    >
                        <Icon className="sb-icon" strokeWidth={1.5} aria-hidden />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </>
    );
}
