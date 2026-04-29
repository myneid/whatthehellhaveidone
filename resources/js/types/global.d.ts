import type { Auth } from '@/types/auth';
import type { SidebarNavigation } from '@/types/navigation';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            navigation: SidebarNavigation;
            [key: string]: unknown;
        };
    }
}
