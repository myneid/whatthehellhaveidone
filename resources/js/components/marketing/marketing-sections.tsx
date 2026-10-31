import { Link } from '@inertiajs/react';
import { ArrowRight, Check, Minus } from 'lucide-react';
import type { ComponentType } from 'react';
import { useMarketingProps } from '@/components/marketing/marketing-page';
import { dashboard, register } from '@/routes';

export type PricingDependent = {
    isAboutPricing?: boolean;
};

export type ComparisonRow = PricingDependent & {
    feature: string;
    whhid: string;
    competitor: string;
    whhidWins: boolean;
    /** Both sides handle this well; each column gets a check. */
    isTie?: boolean;
};

export type MarketingFeature = {
    icon: ComponentType<{ className?: string }>;
    title: string;
    body: string;
    color: string;
    bg: string;
};

/**
 * Drop items that quote prices or plan limits when this install has billing turned off.
 */
export function withoutPricingWhenBillingDisabled<T extends PricingDependent>(
    items: T[],
    billingEnabled: boolean,
): T[] {
    return billingEnabled
        ? items
        : items.filter((item) => !item.isAboutPricing);
}

export function SectionHeading({
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

function WinMarker({ isWinner }: { isWinner: boolean }) {
    return isWinner ? (
        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
    ) : (
        <Minus className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
    );
}

export function ComparisonTable({
    competitorName,
    rows,
}: {
    competitorName: string;
    rows: ComparisonRow[];
}) {
    const { billingEnabled } = useMarketingProps();

    return (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5">
            <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                    <tr className="border-b border-white/10 text-white/50">
                        <th className="px-5 py-4 font-semibold">
                            <span className="sr-only">Feature</span>
                        </th>
                        <th className="px-5 py-4 font-semibold text-violet-300">
                            What the HELL have i DONE
                        </th>
                        <th className="px-5 py-4 font-semibold">
                            {competitorName}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {withoutPricingWhenBillingDisabled(
                        rows,
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
                                    <WinMarker
                                        isWinner={row.isTie || row.whhidWins}
                                    />
                                    {row.whhid}
                                </span>
                            </td>
                            <td className="px-5 py-4 align-top text-white/60">
                                <span className="flex gap-2">
                                    <WinMarker
                                        isWinner={row.isTie || !row.whhidWins}
                                    />
                                    {row.competitor}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function FeatureGrid({ features }: { features: MarketingFeature[] }) {
    return (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, body, color, bg }) => (
                <div
                    key={title}
                    className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                    <div className={`mb-4 inline-flex rounded-xl p-2.5 ${bg}`}>
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
    );
}

export function MarketingHero({
    eyebrow,
    eyebrowIcon: EyebrowIcon,
    title,
    highlight,
    description,
    canRegister,
    primaryLabel,
    secondaryHref,
    secondaryLabel,
}: {
    eyebrow: string;
    eyebrowIcon: ComponentType<{ className?: string }>;
    title: string;
    highlight: string;
    description: string;
    canRegister: boolean;
    primaryLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
}) {
    const { isLoggedIn } = useMarketingProps();

    return (
        <section className="mx-auto max-w-4xl px-6 pt-12 pb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5">
                <EyebrowIcon className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
                    {eyebrow}
                </span>
            </div>
            <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {title}{' '}
                <span className="bg-gradient-to-r from-red-400 via-amber-400 to-yellow-300 bg-clip-text text-transparent">
                    {highlight}
                </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/60">
                {description}
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                {!isLoggedIn && canRegister && (
                    <Link
                        href={register()}
                        className="rounded-2xl bg-violet-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition-all hover:bg-violet-500"
                    >
                        {primaryLabel}
                    </Link>
                )}
                <Link
                    href={secondaryHref}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-8 py-3.5 text-base font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white"
                >
                    {secondaryLabel}
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    );
}

export function CompetitorWinsList({
    competitorName,
    reasons,
}: {
    competitorName: string;
    reasons: (PricingDependent & { reason: string })[];
}) {
    const { billingEnabled } = useMarketingProps();

    return (
        <section className="mx-auto max-w-4xl px-6 py-16">
            <SectionHeading
                eyebrow="Fair is fair"
                title={`When ${competitorName} is the better choice`}
                description="We'd rather you pick the right tool than churn in a month."
            />
            <ul className="space-y-3">
                {withoutPricingWhenBillingDisabled(reasons, billingEnabled).map(
                    ({ reason }) => (
                        <li
                            key={reason}
                            className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-white/70"
                        >
                            <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                            {reason}
                        </li>
                    ),
                )}
            </ul>
        </section>
    );
}

export function FaqList({
    faqs,
}: {
    faqs: (PricingDependent & { question: string; answer: string })[];
}) {
    const { billingEnabled } = useMarketingProps();

    return (
        <div className="space-y-4">
            {withoutPricingWhenBillingDisabled(faqs, billingEnabled).map(
                ({ question, answer }) => (
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
                ),
            )}
        </div>
    );
}

export function CallToAction({
    title,
    body,
    canRegister,
}: {
    title: string;
    body: string;
    canRegister: boolean;
}) {
    const { isLoggedIn } = useMarketingProps();

    return (
        <section className="mx-auto max-w-6xl px-6 py-16">
            <div className="rounded-3xl bg-gradient-to-br from-violet-700 to-indigo-800 p-10 text-center shadow-2xl shadow-violet-900/40 sm:p-16">
                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                    {title}
                </h2>
                <p className="mb-8 text-lg text-white/70">{body}</p>
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
    );
}
