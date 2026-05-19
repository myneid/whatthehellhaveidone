type DocsToolRow = {
    name: string;
    description: string;
};

type DocsToolsTableProps = {
    tools: DocsToolRow[];
};

export function DocsToolsTable({ tools }: DocsToolsTableProps) {
    return (
        <div className="docs-surface overflow-hidden rounded-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-docs-border bg-docs-surface-elevated/80">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                Tool
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                                What it does
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-docs-border">
                        {tools.map((tool) => (
                            <tr
                                key={tool.name}
                                className="transition-colors hover:bg-docs-surface-elevated/50"
                            >
                                <td className="px-4 py-3.5 font-mono text-xs text-brand-accent">
                                    {tool.name}
                                </td>
                                <td className="px-4 py-3.5 text-muted-foreground">
                                    {tool.description}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
