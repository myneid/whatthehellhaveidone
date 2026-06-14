import React from 'react';
import { Link } from '@inertiajs/react';
import { Home, LayoutDashboard, Settings, Calendar } from 'lucide-react';
import { dashboard } from '@/routes';
import { index as boardsIndex } from '@/routes/boards';
import { edit as profileEdit } from '@/routes/profile';
import { index as workLogIndex } from '@/routes/work-log';
import { cn } from '@/lib/utils';
import { MobileBottomNav } from './MobileBottomNav';
import { MobileTabButton } from './MobileTabButton';

interface MobileNavProps {
    currentRoute?: string;
    className?: string;
}

export function MobileNav({ currentRoute, className }: MobileNavProps) {
    const navItems = [
        { label: 'Home', href: dashboard().url, icon: Home },
        { label: 'Boards', href: boardsIndex().url, icon: LayoutDashboard },
        { label: 'Work Log', href: workLogIndex().url, icon: Calendar },
        { label: 'Settings', href: profileEdit().url, icon: Settings },
    ];

    return (
        <MobileBottomNav className={cn("px-4", className)}>
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.href;
                
                return (
                    <Link 
                        key={item.href} 
                        href={item.href} 
                        className="flex-1"
                    >
                        <MobileTabButton 
                            icon={item.icon}
                            label={item.label}
                            isActive={isActive}
                            className={cn(isActive ? 'rounded-full bg-primary/10' : '')}
                        />
                    </Link>
                );
            })}
        </MobileBottomNav>
    );
}
