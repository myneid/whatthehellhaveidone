import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Check, Crown, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { dashboard, login, register } from '@/routes';

export default function Pricing() {
    const { auth } = usePage().props as { auth?: { user?: { id?: number }; hasPaidAccess?: boolean } };
    const isLoggedIn = !!auth?.user;
    const hasPaidAccess = !!auth?.hasPaidAccess;
    const checkoutForm = useForm({});

    return (
        <>
            <Head title="Pricing" />

            <div className="min-h-screen bg-background text-foreground">
                <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                    <Link href="/" className="text-lg font-semibold tracking-tight">
                        What the HELL have I done
                    </Link>

                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <Link href={dashboard()}>
                                <Button variant="outline">Dashboard</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={login()}>
                                    <Button variant="ghost">Log in</Button>
                                </Link>
                                <Link href={register()}>
                                    <Button>Get started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6 pb-16 pt-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-300">
                            <Sparkles className="h-3.5 w-3.5" />
                            Simple pricing
                        </div>
                        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                            Choose the plan that fits your team.
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Every signup starts free with 1 project and 2 boards. Upgrade when you need more room to grow.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 lg:grid-cols-2">
                        <div className="rounded-2xl border bg-card p-8 shadow-sm">
                            <div className="mb-6 flex items-center gap-2 text-violet-300">
                                <ShieldCheck className="h-5 w-5" />
                                <span className="font-medium">Free</span>
                            </div>
                            <div className="mb-4 text-4xl font-semibold">$0 <span className="text-base text-muted-foreground">/month</span></div>
                            <p className="mb-6 text-muted-foreground">Perfect for solo planning and a first project.</p>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />1 project</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />2 boards total</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />Kanban, work log, GitHub sync</li>
                            </ul>
                        </div>

                        <div className="rounded-2xl border border-violet-500/40 bg-violet-500/5 p-8 shadow-lg shadow-violet-500/5">
                            <div className="mb-6 flex items-center gap-2 text-violet-300">
                                <Crown className="h-5 w-5" />
                                <span className="font-medium">Full access</span>
                            </div>
                            <div className="mb-4 text-4xl font-semibold">$4 <span className="text-base text-muted-foreground">/user/month</span></div>
                            <p className="mb-6 text-muted-foreground">Unlimited projects, boards, and collaboration for growing teams.</p>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />Unlimited projects</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />Unlimited boards</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-500" />Full team access and no soft limits</li>
                            </ul>

                            <div className="mt-8">
                                {isLoggedIn ? (
                                    hasPaidAccess ? (
                                        <Button className="w-full" variant="secondary" disabled>
                                            Already on full access
                                        </Button>
                                    ) : (
                                        <Button
                                            type="button"
                                            className="w-full"
                                            disabled={checkoutForm.processing}
                                            onClick={() => checkoutForm.post('/billing/checkout')}
                                        >
                                            Upgrade now
                                        </Button>
                                    )
                                ) : (
                                    <Link href={register()} className="block">
                                        <Button className="w-full">Create account to upgrade</Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
