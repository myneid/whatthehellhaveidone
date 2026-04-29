import { Head, Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Bot,
    CheckSquare,
    Github,
    KanbanSquare,
    MessageSquare,
    Shield,
    Zap,
} from 'lucide-react';
import { dashboard, login, register } from '@/routes';

type Props = {
    canRegister?: boolean;
};

const features = [
    {
        icon: KanbanSquare,
        title: 'Kanban Boards',
        description:
            'Drag-and-drop cards across customizable lists. Multiple boards per project, priorities, due dates, labels, assignees, and checklists.',
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
    },
    {
        icon: Github,
        title: 'GitHub Sync',
        description:
            'Connect repositories to boards. Sync issues as cards, create GitHub issues from cards, and receive webhooks to keep everything in lockstep.',
        color: 'text-slate-300',
        bg: 'bg-slate-500/10',
    },
    {
        icon: MessageSquare,
        title: 'Discord Notifications',
        description:
            'Fire webhook notifications to Discord when cards move, get created, or hit their due date. Keep your whole team in the loop.',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
    },
    {
        icon: BookOpen,
        title: 'Work Log',
        description:
            'Every card action is automatically logged. Add manual entries, tag projects with #hashtags, export to CSV/JSON, and build a full history of what you did.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
    },
    {
        icon: Bot,
        title: 'MCP Server for AI Agents',
        description:
            'An MCP-compatible server lets Claude and other AI agents read boards, move cards, log work, and fetch documents — all with your permission model.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
    },
    {
        icon: BookOpen,
        title: 'Document Repository',
        description:
            'Write project docs in Markdown, organise them in folders, and let AI agents fetch them on demand. Knowledge lives where work happens.',
        color: 'text-sky-400',
        bg: 'bg-sky-500/10',
    },
];

function FeatureCard({
    icon: Icon,
    title,
    description,
    color,
    bg,
}: (typeof features)[0]) {
    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/8">
            <div className={`mb-4 inline-flex rounded-xl p-2.5 ${bg}`}>
                <Icon className={`h-6 w-6 ${color}`} />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm leading-relaxed text-white/60">{description}</p>
        </div>
    );
}

export default function Welcome({ canRegister = true }: Props) {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;

    return (
        <>
            <Head title="What the HELL have i DONE — Project Management">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #12101a 50%, #0f0a14 100%)', fontFamily: "'Instrument Sans', sans-serif" }}>

                {/* Nav */}
                <nav className="mx-auto flex max-w-6xl items-center justify-end px-6 py-5">
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

                {/* Hero */}
                <section className="mx-auto max-w-6xl px-6 pb-20 pt-8 text-center">
                    {/* Big centered logo */}
                    <div className="mb-10 flex justify-center">
                        <img
                            src="/whatthehellhaveidone.png"
                            alt="What the HELL have i DONE"
                            className="w-72 sm:w-96 lg:w-[480px] drop-shadow-[0_8px_40px_rgba(139,92,246,0.4)]"
                        />
                    </div>

                    <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
                        <Zap className="h-3.5 w-3.5 text-violet-400" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                            Project Management for Real Teams
                        </span>
                    </div>

                    <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                        Finally know{' '}
                        <span className="bg-gradient-to-r from-red-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                            what the hell
                        </span>
                        <br />
                        you&apos;ve done
                    </h1>

                    <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60">
                        Kanban boards, GitHub sync, Discord notifications, a full work log, AI-agent access via MCP, and a document repository — all in one place that doesn&apos;t make you feel bad about yourself.
                    </p>

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        {isLoggedIn ? (
                            <Link
                                href={dashboard()}
                                className="rounded-2xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500 hover:shadow-violet-800/50"
                            >
                                Open Dashboard
                            </Link>
                        ) : (
                            <>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-2xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500 hover:shadow-violet-800/50"
                                    >
                                        Start for free
                                    </Link>
                                )}
                                <Link
                                    href={login()}
                                    className="rounded-2xl border border-white/20 px-8 py-3.5 text-base font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white"
                                >
                                    Sign in
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Fake board preview */}
                    <div className="relative mx-auto mt-20 max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 shadow-2xl shadow-black/50 backdrop-blur-sm">
                        <div className="rounded-xl bg-[#13111a] p-6">
                            {/* Board header */}
                            <div className="mb-5 flex items-center gap-3">
                                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                                <div className="ml-3 h-5 w-48 rounded bg-white/10" />
                            </div>
                            {/* Columns */}
                            <div className="flex gap-3 overflow-hidden">
                                {['Backlog', 'In Progress', 'Review', 'Done'].map((col, ci) => (
                                    <div key={col} className="flex w-48 shrink-0 flex-col gap-2">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs font-semibold text-white/50">{col}</span>
                                            <span className="text-xs text-white/30">{[4, 3, 2, 5][ci]}</span>
                                        </div>
                                        {Array.from({ length: [3, 2, 2, 3][ci] }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="rounded-lg border border-white/10 bg-white/5 p-3"
                                                style={{
                                                    borderLeftWidth: 3,
                                                    borderLeftColor: [
                                                        ['#ef4444', '#f59e0b', '#8b5cf6'],
                                                        ['#3b82f6', '#10b981'],
                                                        ['#f59e0b', '#ef4444'],
                                                        ['#10b981', '#3b82f6', '#8b5cf6'],
                                                    ][ci][i % 3],
                                                }}
                                            >
                                                <div className="mb-2 h-2.5 rounded bg-white/20" style={{ width: `${[70, 85, 60, 75, 90, 65, 80, 55][ci * 2 + i]}%` }} />
                                                <div className="h-2 rounded bg-white/10" style={{ width: `${[45, 60, 40, 55, 35, 50, 42, 38][ci * 2 + i]}%` }} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                                <div className="flex w-48 shrink-0 items-start">
                                    <div className="w-full rounded-lg border border-dashed border-white/10 p-3 text-center text-xs text-white/30">
                                        + Add card
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="mb-4 text-center">
                        <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                            Everything you need
                        </span>
                    </div>
                    <h2 className="mb-12 text-center text-4xl font-bold text-white">
                        All the pieces, none of the mess
                    </h2>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((f) => (
                            <FeatureCard key={f.title} {...f} />
                        ))}
                    </div>
                </section>

                {/* How it works */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 p-12">
                        <div className="mb-4 text-center">
                            <span className="text-xs font-semibold uppercase tracking-widest text-violet-400">
                                Workflow
                            </span>
                        </div>
                        <h2 className="mb-12 text-center text-4xl font-bold text-white">
                            From chaos to clarity
                        </h2>
                        <div className="grid gap-8 md:grid-cols-4">
                            {[
                                { step: '01', title: 'Create a project', body: 'Spin up a project and invite your team. Each project gets its own boards, documents, and work log.' },
                                { step: '02', title: 'Build your boards', body: 'Boards auto-create 5 default lists and colour-coded labels. Connect a GitHub repo to import issues as cards.' },
                                { step: '03', title: 'Work and track', body: 'Drag cards, leave comments, tick checklists. Every action is logged automatically in your work log.' },
                                { step: '04', title: 'Ship with context', body: 'Ask your AI agent via MCP to check the board, move cards, or surface docs — without leaving your editor.' },
                            ].map(({ step, title, body }) => (
                                <div key={step} className="text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/30 text-xl font-bold text-violet-400">
                                        {step}
                                    </div>
                                    <h3 className="mb-2 font-semibold text-white">{title}</h3>
                                    <p className="text-sm leading-relaxed text-white/50">{body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* AI highlight */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="grid items-center gap-12 lg:grid-cols-2">
                        <div>
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5">
                                <Bot className="h-3.5 w-3.5 text-emerald-400" />
                                <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                                    AI-Native
                                </span>
                            </div>
                            <h2 className="mb-5 text-4xl font-bold text-white">
                                Your AI agent can actually do stuff
                            </h2>
                            <p className="mb-6 leading-relaxed text-white/60">
                                The built-in MCP server exposes your boards, cards, work log, and documents to Claude and other AI agents. Create scoped tokens with allowed-tool lists so agents only touch what they should.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    'List projects and boards',
                                    'Read, create, and move cards',
                                    'Log work entries on your behalf',
                                    'Fetch project documentation',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-3">
                                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                                            <CheckSquare className="h-3 w-3 text-emerald-400" />
                                        </div>
                                        <span className="text-sm text-white/70">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* Code block mock */}
                        <div className="rounded-2xl border border-white/10 bg-[#0d0d12] p-6 font-mono text-sm">
                            <div className="mb-4 flex gap-1.5">
                                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                            </div>
                            <div className="space-y-1.5 text-xs leading-relaxed">
                                <p><span className="text-violet-400">tool</span> <span className="text-white/40">›</span> <span className="text-white/80">list_projects</span></p>
                                <p className="text-white/40">→ My App, Internal Tools, Design System</p>
                                <p className="mt-3"><span className="text-violet-400">tool</span> <span className="text-white/40">›</span> <span className="text-white/80">get_board</span> <span className="text-amber-400">"My App"</span></p>
                                <p className="text-white/40">→ 4 lists, 23 cards, 3 overdue</p>
                                <p className="mt-3"><span className="text-violet-400">tool</span> <span className="text-white/40">›</span> <span className="text-white/80">create_card</span></p>
                                <p className="text-white/40">  title: <span className="text-emerald-400">"Fix auth bug"</span></p>
                                <p className="text-white/40">  list: <span className="text-emerald-400">"In Progress"</span></p>
                                <p className="text-white/40">→ Card #47 created ✓</p>
                                <p className="mt-3"><span className="text-violet-400">tool</span> <span className="text-white/40">›</span> <span className="text-white/80">log_work</span></p>
                                <p className="text-white/40">  <span className="text-emerald-400">"Fixed the auth race condition #my-app"</span></p>
                                <p className="text-white/40">→ Work log entry created ✓</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mx-auto max-w-6xl px-6 py-20">
                    <div className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-800 p-16 text-center shadow-2xl shadow-violet-900/40">
                        <img
                            src="/whatthehellhaveidone.png"
                            alt="What the HELL have i DONE"
                            className="mx-auto mb-6 h-20 w-auto"
                        />
                        <h2 className="mb-4 text-4xl font-bold text-white">
                            Ready to figure it out?
                        </h2>
                        <p className="mb-8 text-lg text-white/70">
                            Stop losing track of what needs doing and start knowing exactly what you&apos;ve done.
                        </p>
                        {isLoggedIn ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-2xl bg-white px-10 py-4 text-base font-bold text-violet-700 shadow-lg transition-all hover:shadow-xl hover:scale-105"
                            >
                                Open Dashboard
                            </Link>
                        ) : canRegister ? (
                            <Link
                                href={register()}
                                className="inline-block rounded-2xl bg-white px-10 py-4 text-base font-bold text-violet-700 shadow-lg transition-all hover:shadow-xl hover:scale-105"
                            >
                                Get started — it&apos;s free
                            </Link>
                        ) : null}
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 py-8">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                        <img
                            src="/whatthehellhaveidone.png"
                            alt="What the HELL have i DONE"
                            className="h-8 w-auto opacity-60"
                        />
                        <p className="text-sm text-white/30">
                            Built with Laravel, React & too much coffee
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
