import {
    BookOpen,
    Bot,
    FileText,
    GitBranch,
    GitPullRequest,
    Github,
    ListChecks,
    MessageSquare,
    PlugZap,
    UserCheck,
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

const workflowSteps = [
    {
        icon: ListChecks,
        title: 'Move a card to In Progress',
        body: 'A linked GitHub issue is created for it, so the work is tracked where the code lives.',
    },
    {
        icon: UserCheck,
        title: 'Pick who works on it',
        body: 'Assign a teammate from the board, hand it to GitHub Copilot, or skip for now.',
    },
    {
        icon: GitPullRequest,
        title: 'Open a pull request',
        body: 'Reference the issue with Fixes #123 and the card moves to Review on its own.',
    },
    {
        icon: Bot,
        title: 'Get it reviewed',
        body: 'Cards you handed to Copilot get a Copilot pull request review requested automatically.',
    },
];

/**
 * GitHub Projects capabilities checked October 2026 against GitHub's docs and changelog.
 */
const comparison: ComparisonRow[] = [
    {
        feature: 'Price',
        whhid: '$4 / user / month after the free tier',
        competitor: 'Included with GitHub',
        whhidWins: false,
        isAboutPricing: true,
    },
    {
        feature: 'Starting work',
        whhid: 'Moving a card to In Progress creates the issue and assigns a teammate or Copilot',
        competitor:
            'Built-in workflows set status when items are added; assignment happens on the issue',
        whhidWins: true,
    },
    {
        feature: 'Pull requests',
        whhid: 'A PR that references the issue moves the card to Review; Copilot review for Copilot cards',
        competitor:
            'Built-in workflows set Done when a PR merges or an issue closes',
        whhidWins: true,
    },
    {
        feature: 'Views',
        whhid: 'Kanban boards',
        competitor: 'Board, table and roadmap views with custom fields',
        whhidWins: false,
    },
    {
        feature: 'Work log',
        whhid: 'Every card action logged automatically, taggable and exportable to CSV/JSON',
        competitor: 'Per-issue timelines',
        whhidWins: true,
    },
    {
        feature: 'AI agents (MCP)',
        whhid: 'Boards, cards, work log and project docs, with scoped tokens',
        competitor:
            "GitHub's MCP server has an opt-in Projects toolset for reading and updating items",
        whhidWins: true,
        isTie: true,
    },
    {
        feature: 'Docs',
        whhid: 'Markdown docs per project, plus browsing the Markdown files in linked repos',
        competitor: 'Repository Markdown and wikis',
        whhidWins: true,
        isTie: true,
    },
    {
        feature: 'Chat notifications',
        whhid: 'Discord webhooks when cards move, get created or hit their due date',
        competitor: 'GitHub notifications, plus chat apps you install',
        whhidWins: true,
    },
];

const features: MarketingFeature[] = [
    {
        icon: Github,
        title: 'Two-way issue sync',
        body: 'Import open issues as cards, create or link issues from cards, and keep status in step through webhooks.',
        color: 'text-slate-300',
        bg: 'bg-slate-500/10',
    },
    {
        icon: GitBranch,
        title: 'Not everything is an issue',
        body: 'Cards stand on their own. Link one to GitHub when it becomes code work, and keep the rest of the plan on the same board.',
        color: 'text-violet-400',
        bg: 'bg-violet-500/10',
    },
    {
        icon: BookOpen,
        title: 'A work log that writes itself',
        body: 'Each card move lands in your work log. Tag entries with #hashtags and export for standups or client invoices.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
    },
    {
        icon: MessageSquare,
        title: 'Discord in the loop',
        body: 'Post to a Discord channel when cards move, get created or hit their due date.',
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10',
    },
];

const setupSteps = [
    {
        icon: PlugZap,
        title: 'Connect GitHub',
        body: 'Authorize with OAuth. You can connect more than one GitHub account.',
    },
    {
        icon: Github,
        title: 'Link a repository',
        body: 'In board settings, connect the repo and turn on pull request automation.',
    },
    {
        icon: FileText,
        title: 'Import your issues',
        body: 'Pull in open issues as cards, or start fresh and create issues as cards move.',
    },
];

const githubProjectsIsBetterWhen: (PricingDependent & { reason: string })[] = [
    {
        reason: 'You want to stay entirely inside GitHub with nothing extra to pay for.',
        isAboutPricing: true,
    },
    {
        reason: 'You need table and roadmap views, or custom fields on every item.',
    },
    {
        reason: 'You track issues across many repositories at organization scale.',
    },
    {
        reason: 'Your team never needs cards that are not GitHub issues.',
    },
];

const faqs: (PricingDependent & { question: string; answer: string })[] = [
    {
        question: 'Is the sync two-way?',
        answer: 'Yes, once webhooks are set up on the repository: changes in GitHub show up on the board and card changes go back to GitHub. Without webhooks you can still import issues one way.',
    },
    {
        question: 'Does every card have to be a GitHub issue?',
        answer: 'No. Cards are native to the board. Create or link an issue when a card turns into code work, and keep design, ops or client tasks on the same board without cluttering your repo.',
    },
    {
        question: 'How does the Copilot handoff work?',
        answer: 'When you move a card to In Progress you can assign it to GitHub Copilot. The linked issue is assigned to the Copilot agent, and when its pull request opens a Copilot review is requested automatically.',
    },
    {
        question: 'Can my AI assistant use the board?',
        answer: 'Yes. The built-in MCP server lets Claude, Cursor and other MCP clients list boards, read, create and move cards, log work and fetch project docs, with tokens limited to the tools you allow.',
    },
    {
        question: 'How much does it cost?',
        answer: 'Free for 1 project and 2 boards. The paid plan is $4 per user per month for unlimited projects, boards and collaboration.',
        isAboutPricing: true,
    },
];

export default function GithubKanbanBoard({ canRegister = true }: Props) {
    return (
        <MarketingPage
            title="Kanban Board for GitHub Issues – What the HELL have I done"
            canRegister={canRegister}
        >
            <MarketingHero
                eyebrow="GitHub kanban board"
                eyebrowIcon={Github}
                title="A kanban board that"
                highlight="works with GitHub"
                description="Move a card and the GitHub issue gets created and assigned. Open a pull request and the card moves to Review. Everything you did lands in a work log your AI agent can read."
                canRegister={canRegister}
                primaryLabel="Connect a repo for free"
                secondaryHref="/docs/github-workflow"
                secondaryLabel="See the GitHub workflow"
            />

            <section className="mx-auto max-w-6xl px-6 py-16">
                <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-900/20 to-indigo-900/20 p-8 sm:p-12">
                    <SectionHeading
                        eyebrow="Workflow"
                        title="From card to merged pull request"
                    />
                    <div className="grid gap-8 md:grid-cols-4">
                        {workflowSteps.map(
                            ({ icon: Icon, title, body }, index) => (
                                <div key={title} className="text-center">
                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600/30">
                                        <Icon className="h-5 w-5 text-violet-300" />
                                    </div>
                                    <p className="mb-1 text-xs font-semibold tracking-widest text-violet-400">
                                        {String(index + 1).padStart(2, '0')}
                                    </p>
                                    <h3 className="mb-2 font-semibold text-white">
                                        {title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-white/50">
                                        {body}
                                    </p>
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 py-16">
                <SectionHeading
                    eyebrow="Built for code work"
                    title="More than a view of your issues"
                />
                <FeatureGrid features={features} />
            </section>

            <section className="mx-auto max-w-5xl px-6 py-16">
                <SectionHeading
                    eyebrow="Side by side"
                    title="What the HELL have i DONE vs GitHub Projects"
                    description="An honest comparison, based on GitHub's documentation as of October 2026."
                />
                <ComparisonTable
                    competitorName="GitHub Projects"
                    rows={comparison}
                />
            </section>

            <section className="mx-auto max-w-6xl px-6 py-16">
                <SectionHeading
                    eyebrow="Setup"
                    title="Connected in three steps"
                />
                <div className="grid gap-8 md:grid-cols-3">
                    {setupSteps.map(({ icon: Icon, title, body }) => (
                        <div
                            key={title}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                        >
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
            </section>

            <CompetitorWinsList
                competitorName="GitHub Projects"
                reasons={githubProjectsIsBetterWhen}
            />

            <section className="mx-auto max-w-4xl px-6 py-16">
                <SectionHeading eyebrow="FAQ" title="GitHub kanban questions" />
                <FaqList faqs={faqs} />
            </section>

            <CallToAction
                title="Put your issues on a board that keeps up"
                body="Connect a repository and import your open issues in a couple of minutes."
                canRegister={canRegister}
            />
        </MarketingPage>
    );
}
