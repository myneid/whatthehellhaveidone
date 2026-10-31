import { Head, Link, usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { dashboard, home, login, register } from '@/routes';

export type MarketingSharedProps = {
    auth?: { user?: unknown };
    billingEnabled?: boolean;
};

/**
 * Read the shared props every marketing page needs.
 */
export function useMarketingProps(): {
    isLoggedIn: boolean;
    billingEnabled: boolean;
} {
    const { auth, billingEnabled = false } = usePage()
        .props as MarketingSharedProps;

    return { isLoggedIn: !!auth?.user, billingEnabled };
}

function MarketingNav({ canRegister }: { canRegister: boolean }) {
    const { isLoggedIn } = useMarketingProps();

    return (
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link href={home()} className="flex items-center gap-3">
                <img
                    src="/whatthehellhaveidone.png"
                    alt="What the HELL have i DONE"
                    className="h-10 w-auto"
                />
            </Link>
            <div className="flex items-center gap-3">
                {isLoggedIn ? (
                    <Link
                        href={dashboard()}
                        className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                    >
                        Go to Dashboard
                    </Link>
                ) : (
                    <>
                        <Link
                            href={login()}
                            className="rounded-xl px-5 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white"
                        >
                            Log in
                        </Link>
                        {canRegister && (
                            <Link
                                href={register()}
                                className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-500"
                            >
                                Get started
                            </Link>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
}

function MarketingFooter() {
    const { billingEnabled } = useMarketingProps();

    const links = [
        ...(billingEnabled ? [{ href: '/pricing', label: 'Pricing' }] : []),
        { href: '/docs', label: 'Docs' },
        { href: '/trello-alternative', label: 'Trello alternative' },
        { href: '/github-kanban-board', label: 'GitHub kanban' },
        { href: '/terms', label: 'Terms' },
        { href: '/privacy', label: 'Privacy' },
    ];

    return (
        <footer className="border-t border-white/10 py-8">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
                <Link href={home()}>
                    <img
                        src="/whatthehellhaveidone.png"
                        alt="What the HELL have i DONE"
                        className="h-8 w-auto opacity-60"
                    />
                </Link>
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className="text-sm text-white/30 transition-colors hover:text-white/60"
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    );
}

/**
 * Dark, standalone page shell shared by the public marketing pages.
 */
export function MarketingPage({
    title,
    canRegister,
    children,
}: {
    title: string;
    canRegister: boolean;
    children: ReactNode;
}) {
    return (
        <>
            <Head title={title}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div
                className="min-h-screen"
                style={{
                    background:
                        'linear-gradient(135deg, #0a0a0f 0%, #12101a 50%, #0f0a14 100%)',
                    fontFamily: "'Instrument Sans', sans-serif",
                }}
            >
                <MarketingNav canRegister={canRegister} />
                {children}
                <MarketingFooter />
            </div>
        </>
    );
}
