import {
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
import { MarketingPage } from '@/components/marketing/marketing-page';
import {
    CallToAction,
    ComparisonTable,
    CompetitorWinsList,
    FaqList,
    FeatureGrid,
    MarketingHero,
    SectionHeading,
} from '@/components/marketing/marketing-sections';
import type {
    ComparisonRow,
    MarketingFeature,
    PricingDependent,
} from '@/components/marketing/marketing-sections';

type Props = {
    canRegister?: boolean;
};

/**
 * Trello figures checked October 2026. Update this table when Trello changes its plans.
 */
const comparison: ComparisonRow[] = [
    {
        feature: 'Paid plan',
        whhid: '$4 / user / month — unlimited projects and boards',
        competitor:
            'Standard $5 / user / month billed annually ($6 monthly); Premium $10–12.50',
        whhidWins: true,
        isAboutPricing: true,
    },
    {
        feature: 'Free plan',
        whhid: '1 project, 2 boards',
        competitor: 'Up to 10 boards and 10 collaborators per workspace',
        whhidWins: false,
        isAboutPricing: true,
    },
    {
        feature: 'GitHub issues',
        whhid: 'Built in: sync issues as cards, create issues when cards move, auto-move to Review when a PR opens',
        competitor: 'Via the GitHub Power-Up',
        whhidWins: true,
    },
    {
        feature: 'Work log',
        whhid: 'Every card action logged automatically, plus manual entries, #hashtags and CSV/JSON export',
        competitor: 'Per-card activity feed',
        whhidWins: true,
    },
    {
        feature: 'AI agents (MCP)',
        whhid: 'Boards, cards, work log and project docs, with scoped tokens and allowed-tool lists',
        competitor:
            'Official MCP server for boards, lists, cards and checklists',
        whhidWins: true,
    },
    {
        feature: 'Project docs',
        whhid: 'Markdown document repository per project',
        competitor: 'Not built in',
        whhidWins: true,
    },
    {
        feature: 'Editor plugins',
        whhid: 'VS Code and Vim / Neovim',
        competitor: 'No official plugin',
        whhidWins: true,
    },
];

const features: MarketingFeature[] = [
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

export default function TrelloAlternative({ canRegister = true }: Props) {
    return (
        <MarketingPage
            title="Trello Alternative for Developers – What the HELL have I done"
            canRegister={canRegister}
        >
            <MarketingHero
                eyebrow="Trello alternative"
                eyebrowIcon={KanbanSquare}
                title="The Trello alternative"
                highlight="built for developers"
                description="Kanban boards with GitHub issue sync, an automatic work log, project docs, and an MCP server your AI agent can use. Import your Trello boards in a few clicks."
                canRegister={canRegister}
                primaryLabel="Start free and import your boards"
                secondaryHref="/docs/trello-import"
                secondaryLabel="How the import works"
            />

            <section className="mx-auto max-w-5xl px-6 py-16">
                <SectionHeading
                    eyebrow="Side by side"
                    title="What the HELL have i DONE vs Trello"
                    description="An honest comparison. Trello figures are from its public pricing as of October 2026."
                />
                <ComparisonTable competitorName="Trello" rows={comparison} />
            </section>

            <section className="mx-auto max-w-6xl px-6 py-16">
                <SectionHeading
                    eyebrow="Why switch"
                    title="Made for people who ship code"
                />
                <FeatureGrid features={features} />
            </section>

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

            <CompetitorWinsList
                competitorName="Trello"
                reasons={trelloIsBetterWhen}
            />

            <section className="mx-auto max-w-4xl px-6 py-16">
                <SectionHeading eyebrow="FAQ" title="Switching from Trello" />
                <FaqList faqs={faqs} />
            </section>

            <CallToAction
                title="Try it with one of your Trello boards"
                body="Import a board and see if it sticks."
                canRegister={canRegister}
            />
        </MarketingPage>
    );
}
