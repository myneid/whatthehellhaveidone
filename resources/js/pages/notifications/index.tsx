import { Head, Link, router } from '@inertiajs/react';
import { Bell, Check, Trash2 } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import {
    destroy,
    markAllAsRead,
    markAsRead,
} from '@/actions/App/Http/Controllers/NotificationController';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Notification = {
    id: string;
    card_id?: number;
    card_title?: string;
    action?: string;
    actor_name?: string;
    detail?: string | null;
    board_slug?: string | null;
    href?: string | null;
    read_at: string | null;
    created_at: string;
};

type Props = { notifications: Notification[] };

function formatNotification(notification: Notification): string {
    const actor = notification.actor_name ?? 'Someone';
    const action = notification.action ?? 'updated';
    const card = notification.card_title ?? 'a card';

    if (action === 'mentioned') {
        return `${actor} mentioned you on ${card}`;
    }

    return `${actor} ${action} ${card}`;
}

function formatDate(value: string): string {
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

export default function NotificationsIndex({ notifications }: Props) {
    const unreadCount = notifications.filter(
        (notification) => !notification.read_at,
    ).length;

    function readNotification(notification: Notification) {
        router.patch(
            markAsRead(notification.id).url,
            {},
            { preserveScroll: true },
        );
    }

    function readAllNotifications() {
        router.patch(markAllAsRead().url, {}, { preserveScroll: true });
    }

    function deleteNotification(notification: Notification) {
        router.delete(destroy(notification.id).url, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Notifications" />

            <div className="mx-auto max-w-3xl px-6 py-8">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <Heading
                        variant="small"
                        title="Notifications"
                        description={
                            unreadCount === 1
                                ? '1 unread notification'
                                : `${unreadCount} unread notifications`
                        }
                    />

                    {unreadCount > 0 && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={readAllNotifications}
                        >
                            <Check className="h-4 w-4" />
                            Mark all as read
                        </Button>
                    )}
                </div>

                {notifications.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-12 text-center">
                        <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No notifications yet.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {notifications.map((notification) => {
                            const isUnread = !notification.read_at;
                            const content = (
                                <>
                                    <div className="flex items-start gap-3">
                                        <span
                                            className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isUnread ? 'bg-primary' : 'bg-transparent'}`}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-foreground">
                                                {formatNotification(
                                                    notification,
                                                )}
                                            </p>
                                            {notification.detail && (
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    {notification.detail}
                                                </p>
                                            )}
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {formatDate(
                                                    notification.created_at,
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            );

                            return (
                                <div
                                    key={notification.id}
                                    className={`flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-start sm:justify-between ${isUnread ? 'border-primary/30 bg-primary/5' : 'bg-background'}`}
                                >
                                    {notification.href ? (
                                        <Link
                                            href={notification.href}
                                            className="min-w-0 flex-1"
                                        >
                                            {content}
                                        </Link>
                                    ) : (
                                        <div className="min-w-0 flex-1">
                                            {content}
                                        </div>
                                    )}

                                    <div className="flex shrink-0 items-center gap-1 self-end sm:self-start">
                                        {isUnread && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    readNotification(
                                                        notification,
                                                    )
                                                }
                                            >
                                                <Check className="h-4 w-4" />
                                                Mark read
                                            </Button>
                                        )}
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() =>
                                                deleteNotification(notification)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">
                                                Delete notification
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

NotificationsIndex.layout = (): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Notifications' },
    ],
});
