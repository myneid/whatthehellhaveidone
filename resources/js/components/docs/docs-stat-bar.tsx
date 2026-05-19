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
            className={`grid w-full shrink-0 grid-cols-3 divide-x divide-border overflow-hidden rounded-xl border border-border bg-muted/20 ${className}`}
        >
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex min-w-0 flex-col items-center justify-center px-3 py-4 sm:px-5"
                >
                    <dt className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {stat.label}
                    </dt>
                    <dd className="mt-1.5 whitespace-nowrap text-lg font-bold tabular-nums text-foreground sm:text-xl">
                        {stat.value}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
