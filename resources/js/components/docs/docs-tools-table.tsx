type DocsToolRow = {
    name: string;
    description: string;
};

type DocsToolsTableProps = {
    tools: DocsToolRow[];
};

export function DocsToolsTable({ tools }: DocsToolsTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="border-b border-border bg-muted/40">
                        <tr>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">
                                Tool
                            </th>
                            <th className="px-4 py-3 text-left font-semibold text-foreground">
                                What it does
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {tools.map((tool) => (
                            <tr key={tool.name} className="bg-card/80">
                                <td className="px-4 py-3 font-mono text-xs text-foreground">
                                    {tool.name}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
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
