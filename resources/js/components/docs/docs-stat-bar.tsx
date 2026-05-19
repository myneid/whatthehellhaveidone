type DocsStat = {
    label: string;
    value: string;
};

type DocsStatBarProps = {
    stats: DocsStat[];
    className?: string;
};

export function DocsStatBar({ stats, className = '' }: DocsStatBarProps) {
    return (
        <dl
            className={`docs-stat-bar grid w-full shrink-0 grid-cols-3 divide-x divide-docs-border overflow-hidden rounded-2xl ${className}`}
        >
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex min-w-0 flex-col items-center justify-center px-3 py-5 sm:px-5"
                >
                    <dt className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {stat.label}
                    </dt>
                    <dd className="mt-2 whitespace-nowrap text-lg font-bold tabular-nums text-foreground sm:text-xl">
                        {stat.value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
