import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    BookOpen,
    Bot,
    Check,
    Code2,
    Download,
    FileJson,
    Github,
    KanbanSquare,
    Minus,
    Upload,
} from 'lucide-react';
import { dashboard, home, login, register } from '@/routes';

type Props = {
    canRegister?: boolean;
};

type ComparisonRow = {
    feature: string;
    whhid: string;
    trello: string;
    whhidWins: boolean;
    isAboutPricing?: boolean;
};

type PricingDependent = {
    isAboutPricing?: boolean;
};

/**
 * Drop items that quote prices or plan limits when this install has billing turned off.
 */
function withoutPricingWhenBillingDisabled<T extends PricingDependent>(
    items: T[],
    billingEnabled: boolean,
): T[] {
    return billingEnabled
        ? items
        : items.filter((item) => !item.isAboutPricing);
}

/**
 * Trello figures checked October 2026. Update this table when Trello changes its plans.
 */
const comparison: ComparisonRow[] = [
    {
        feature: 'Paid plan',
        whhid: '$4 / user / month — unlimited projects and boards',
        trello: 'Standard $5 / user / month billed annually ($6 monthly); Premium $10–12.50',
        whhidWins: true,
        isAboutPricing: true,
    },
    {
        feature: 'Free plan',
        whhid: '1 project, 2 boards',
        trello: 'Up to 10 boards and 10 collaborators per workspace',
        whhidWins: false,
        isAboutPricing: true,
    },
    {
        feature: 'GitHub issues',
        whhid: 'Built in: sync issues as cards, create issues when cards move, auto-move to Review when a PR opens',
        trello: 'Via the GitHub Power-Up',
        whhidWins: true,
    },
    {
        feature: 'Work log',
        whhid: 'Every card action logged automatically, plus manual entries, #hashtags and CSV/JSON export',
        trello: 'Per-card activity feed',
        whhidWins: true,
    },
    {
        feature: 'AI agents (MCP)',
        whhid: 'Boards, cards, work log and project docs, with scoped tokens and allowed-tool lists',
        trello: 'Official MCP server for boards, lists, cards and checklists',
        whhidWins: true,
    },
    {
        feature: 'Project docs',
        whhid: 'Markdown document repository per project',
        trello: 'Not built in',
        whhidWins: true,
    },
    {
        feature: 'Editor plugins',
        whhid: 'VS Code and Vim / Neovim',
        trello: 'No official plugin',
        whhidWins: true,
    },
];

const importSteps = [
    {
        icon: Download,
        title: 'Export from Trello',
        body: 'Open your board menu in Trello, choose Print, export and share, then Export as JSON.',
    },
    {
        icon: Upload,
        title: 'Upload the JSON',
        body: 'Create a board here and upload the file (up to 10 MB). The import runs in the background.',
    },
    {
        icon: KanbanSquare,
        title: 'Keep working',
        body: 'Lists, cards, labels, checklists and due dates land on your new board, in the same order.',
    },
];

const transfers = [
    'Lists, in order',
    'Open cards with descriptions and due dates',
    'Labels and their colors',
    'Checklists with completion state',
];

const doesNotTransfer = [
    'Archived lists and cards',
    'Attachments',
    'Comments and activity history',
    'Member assignments',
];

const trelloIsBetterWhen: (PricingDependent & { reason: string })[] = [
    {
        reason: 'You need a bigger free plan: Trello allows 10 boards free, we allow 2.',
        isAboutPricing: true,
    },
    { reason: 'Your team lives on mobile and wants mature native apps.' },
    { reason: 'You depend on specific Power-Ups from the Trello ecosystem.' },
    {
        reason: 'Most of your board users are non-technical and never touch GitHub.',
    },
];

const faqs: (PricingDependent & { question: string; answer: string })[] = [
    {
        question: 'Can I move my Trello boards over?',
        answer: 'Yes. Export a board from Trello as JSON and upload it. Lists, open cards, labels, checklists and due dates come across automatically. Attachments, comments, archived items and member assignments do not.',
    },
    {
        question: 'Does it work with Claude, Cursor and other AI assistants?',
        answer: 'Yes. The built-in MCP server lets any MCP-compatible assistant list your boards, read, create and move cards, log work and fetch project docs. Tokens can be limited to specific tools.',
    },
    {
        question: 'How does GitHub sync work?',
        answer: 'Connect a repository to a board. Issues sync in as cards, moving a card can create a GitHub issue and assign it to a teammate or Copilot, and cards move to Review automatically when a pull request opens.',
    },
    {
        question: 'How much does it cost?',
        answer: 'Free for 1 project and 2 boards. The paid plan is $4 per user per month for unlimited projects, boards and collaboration.',
        isAboutPricing: true,
    },
];

function NavBar({
    isLoggedIn,
    canRegister,
}: {
    isLoggedIn: boolean;
    canRegister: boolean;
}) {
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

function SectionHeading({
    eyebrow,
    title,
    description,
}: {
    eyebrow: string;
    title: string;
    description?: string;
}) {
    return (
        <div className="mb-10 text-center">
            <span className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
                {eyebrow}
            </span>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
                {title}
            </h2>
            {description && (
                <p className="mx-auto mt-4 max-w-2xl text-white/60">
                    {description}
                </p>
            )}
        </div>
    );
}

export default function TrelloAlternative({ canRegister = true }: Props) {
    const { auth, billingEnabled = false } = usePage().props as {
        auth?: { user?: unknown };
        billingEnabled?: boolean;
    };
    const isLoggedIn = !!auth?.user;

    return (
        <>
            <Head title="Trello Alternative for Developers – What the HELL have I done">
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
                <NavBar isLoggedIn={isLoggedIn} canRegister={canRegister} />

                {/* Hero */}
                <section className="mx-auto max-w-4xl px-6 pt-12 pb-16 text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
                        <KanbanSquare className="h-3.5 w-3.5 text-violet-400" />
                        <span className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
                            Trello alternative
                        </span>
                    </div>
                    <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        The Trello alternative{' '}
                        <span className="bg-gradient-to-r from-red-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                            built for developers
                        </span>
                    </h1>
                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60">
                        Kanban boards with GitHub issue sync, an automatic work
                        log, project docs, and an MCP server your AI agent can
                        use. Import your Trello boards in a few clicks.
                    </p>
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        {!isLoggedIn && canRegister && (
                            <Link
                                href={register()}
                                className="rounded-2xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500"
                            >
                                Start free and import your boards
                            </Link>
                        )}
                        <Link
                            href="/docs/trello-import"
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-8 py-3.5 text-base font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white"
                        >
                            How the import works
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>

                {/* Comparison */}
                <section className="mx-auto max-w-5xl px-6 py-16">
                    <SectionHeading
                        eyebrow="Side by side"
                        title="What the HELL have i DONE vs Trello"
                        description="An honest comparison. Trello figures are from its public pricing as of October 2026."
                    />
                    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-white/10 text-white/50">
                                    <th className="px-5 py-4 font-semibold"></th>
                                    <th className="px-5 py-4 font-semibold text-violet-300">
                                        What the HELL have i DONE
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Trello
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {withoutPricingWhenBillingDisabled(
                                    comparison,
                                    billingEnabled,
                                ).map((row) => (
                                    <tr
                                        key={row.feature}
                                        className="border-b border-white/5 last:border-0"
                                    >
                                        <th
                                            scope="row"
                                            className="px-5 py-4 align-top font-semibold text-white"
                                        >
                                            {row.feature}
                                        </th>
                                        <td className="px-5 py-4 align-top text-white/80">
                                            <span className="flex gap-2">
                                                {row.whhidWins ? (
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                                                ) : (
                                                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                                                )}
                                                {row.whhid}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 align-top text-white/60">
                                            <span className="flex gap-2">
                                                {row.whhidWins ? (
                                                    <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                                                ) : (
                                                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                                                )}
                                                {row.trello}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Developer features */}
                <section className="mx-auto max-w-6xl px-6 py-16">
                    <SectionHeading
                        eyebrow="Why switch"
                        title="Made for people who ship code"
                    />
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            {
                                icon: Github,
                                title: 'GitHub in the loop',
                                body: 'Issues become cards. Moving a card can open an issue and assign it to a teammate or Copilot.',
                                color: 'text-slate-300',
                                bg: 'bg-slate-500/10',
                            },
                            {
                                icon: BookOpen,
                                title: 'A work log that writes itself',
                                body: 'Every card move is logged. Add notes, tag with #hashtags, and export for standups or client invoices.',
                                color: 'text-amber-400',
                                bg: 'bg-amber-500/10',
                            },
                            {
                                icon: Bot,
                                title: 'Your AI agent can help',
                                body: 'Claude, Cursor and other MCP clients can read the board, move cards, log work and pull docs.',
                                color: 'text-emerald-400',
                                bg: 'bg-emerald-500/10',
                            },
                            {
                                icon: Code2,
                                title: 'Stay in your editor',
                                body: 'Browse boards, create cards and log work from VS Code or Vim / Neovim.',
                                color: 'text-orange-400',
                                bg: 'bg-orange-500/10',
                            },
                        ].map(({ icon: Icon, title, body, color, bg }) => (
                            <div
                                key={title}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6"
                            >
                                <div
                                    className={`mb-4 inline-flex rounded-xl p-2.5 ${bg}`}
                                >
                                    <Icon className={`h-6 w-6 ${color}`} />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-white">
                                    {title}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/60">
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Import */}
                <section className="mx-auto max-w-6xl px-6 py-16">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 p-8 sm:p-12">
                        <SectionHeading
                            eyebrow="Migration"
                            title="Bring your Trello boards with you"
                        />
                        <div className="mb-12 grid gap-8 md:grid-cols-3">
                            {importSteps.map(({ icon: Icon, title, body }) => (
                                <div key={title} className="text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/30">
                                        <Icon className="h-5 w-5 text-violet-300" />
                                    </div>
                                    <h3 className="mb-2 font-semibold text-white">
                                        {title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/50">
                                        {body}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                                <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                                    <FileJson className="h-4 w-4 text-emerald-400" />
                                    Comes over automatically
                                </h3>
                                <ul className="space-y-2 text-sm text-white/70">
                                    {transfers.map((item) => (
                                        <li key={item} className="flex gap-2">
                                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-black/20 p-6">
                                <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                                    <Minus className="h-4 w-4 text-white/40" />
                                    Doesn&apos;t transfer
                                </h3>
                                <ul className="space-y-2 text-sm text-white/60">
                                    {doesNotTransfer.map((item) => (
                                        <li key={item} className="flex gap-2">
                                            <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* When Trello wins */}
                <section className="mx-auto max-w-4xl px-6 py-16">
                    <SectionHeading
                        eyebrow="Fair is fair"
                        title="When Trello is the better choice"
                        description="We'd rather you pick the right tool than churn in a month."
                    />
                    <ul className="space-y-3">
                        {withoutPricingWhenBillingDisabled(
                            trelloIsBetterWhen,
                            billingEnabled,
                        ).map(({ reason }) => (
                            <li
                                key={reason}
                                className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white/70"
                            >
                                <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                                {reason}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* FAQ */}
                <section className="mx-auto max-w-4xl px-6 py-16">
                    <SectionHeading
                        eyebrow="FAQ"
                        title="Switching from Trello"
                    />
                    <div className="space-y-4">
                        {withoutPricingWhenBillingDisabled(
                            faqs,
                            billingEnabled,
                        ).map(({ question, answer }) => (
                            <div
                                key={question}
                                className="rounded-2xl border border-white/10 bg-white/5 p-6"
                            >
                                <h3 className="mb-2 font-semibold text-white">
                                    {question}
                                </h3>
                                <p className="text-sm leading-relaxed text-white/60">
                                    {answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-6xl px-6 py-16">
                    <div className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-800 p-10 text-center shadow-2xl shadow-violet-900/40 sm:p-16">
                        <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                            Try it with one of your Trello boards
                        </h2>
                        <p className="mb-8 text-lg text-white/70">
                            Free for your first project. Import a board and see
                            if it sticks.
                        </p>
                        {isLoggedIn ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-2xl bg-white px-10 py-4 text-base font-bold text-violet-700 shadow-lg transition-all hover:scale-105"
                            >
                                Open Dashboard
                            </Link>
                        ) : canRegister ? (
                            <Link
                                href={register()}
                                className="inline-block rounded-2xl bg-white px-10 py-4 text-base font-bold text-violet-700 shadow-lg transition-all hover:scale-105"
                            >
                                Get started — it&apos;s free
                            </Link>
                        ) : null}
                    </div>
                </section>

                <footer className="border-t border-white/10 py-8">
                    <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
                        <Link href={home()}>
                            <img
                                src="/whatthehellhaveidone.png"
                                alt="What the HELL have i DONE"
                                className="h-8 w-auto opacity-60"
                            />
                        </Link>
                        <div className="flex items-center gap-6">
                            {billingEnabled && (
                                <Link
                                    href="/pricing"
                                    className="text-sm text-white/30 transition-colors hover:text-white/60"
                                >
                                    Pricing
                                </Link>
                            )}
                            <Link
                                href="/docs"
                                className="text-sm text-white/30 transition-colors hover:text-white/60"
                            >
                                Docs
                            </Link>
                            <Link
                                href="/terms"
                                className="text-sm text-white/30 transition-colors hover:text-white/60"
                            >
                                Terms
                            </Link>
                            <Link
                                href="/privacy"
                                className="text-sm text-white/30 transition-colors hover:text-white/60"
                            >
                                Privacy
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
