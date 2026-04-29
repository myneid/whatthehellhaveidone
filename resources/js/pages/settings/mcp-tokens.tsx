import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Copy, Eye, EyeOff, KeyRound, Plus, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import * as mcpTokens from '@/routes/mcp-tokens';

type McpToken = {
    id: number;
    name: string;
    scopes: string[];
    allowed_tools: string[] | null;
    last_used_at: string | null;
    revoked_at: string | null;
    created_at: string;
};

type Props = {
    tokens: McpToken[];
};

function NewTokenAlert({ token, onDismiss }: { token: string; onDismiss: () => void }) {
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    function copy() {
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    return (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 space-y-3">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
                Token created — copy it now. It will not be shown again.
            </p>
            <div className="flex items-center gap-2">
                <code className="flex-1 rounded bg-muted px-3 py-2 text-sm font-mono break-all">
                    {visible ? token : '•'.repeat(Math.min(token.length, 48))}
                </code>
                <Button size="icon" variant="ghost" onClick={() => setVisible((v) => !v)}>
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={copy}>
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
            {copied && <p className="text-xs text-green-600 dark:text-green-400">Copied!</p>}
            <Button size="sm" variant="outline" onClick={onDismiss}>Dismiss</Button>
        </div>
    );
}

export default function McpTokensSettings({ tokens }: Props) {
    const { props } = usePage<{ flash: { token?: string } }>();
    const [newToken, setNewToken] = useState<string | null>(null);
    const form = useForm({ name: '' });
    const nameRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (props.flash?.token) {
            setNewToken(props.flash.token);
        }
    }, [props.flash?.token]);

    function createToken(e: React.FormEvent) {
        e.preventDefault();
        form.post(mcpTokens.store().url, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    function revoke(token: McpToken) {
        router.delete(mcpTokens.destroy(token).url, { preserveScroll: true });
    }

    const active = tokens.filter((t) => !t.revoked_at);
    const revoked = tokens.filter((t) => t.revoked_at);

    return (
        <>
            <Head title="MCP Tokens" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="MCP API Tokens"
                    description="Create tokens to connect AI assistants (Claude, ChatGPT) to your workspace via the MCP protocol."
                />

                {newToken && (
                    <NewTokenAlert token={newToken} onDismiss={() => setNewToken(null)} />
                )}

                {/* Create form */}
                <div className="rounded-lg border p-4 space-y-4">
                    <h3 className="text-sm font-medium">Create New Token</h3>
                    <form onSubmit={createToken} className="flex gap-2">
                        <Input
                            ref={nameRef}
                            placeholder="Token name (e.g. Claude Desktop)"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            className="flex-1"
                        />
                        <Button type="submit" size="sm" disabled={form.processing || !form.data.name.trim()}>
                            <Plus className="mr-1.5 h-4 w-4" />
                            Create
                        </Button>
                    </form>
                    {form.errors.name && <p className="text-xs text-destructive">{form.errors.name}</p>}
                </div>

                {/* Active tokens */}
                {active.length > 0 && (
                    <div className="space-y-3">
                        <Label className="text-xs uppercase text-muted-foreground">Active Tokens</Label>
                        {active.map((token) => (
                            <div key={token.id} className="flex items-center justify-between rounded-lg border px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <KeyRound className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="text-sm font-medium">{token.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Created {new Date(token.created_at).toLocaleDateString()}
                                            {token.last_used_at && ` · Last used ${new Date(token.last_used_at).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => revoke(token)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {active.length === 0 && !newToken && (
                    <p className="text-sm text-muted-foreground">No active tokens. Create one above to connect an AI assistant.</p>
                )}

                {revoked.length > 0 && (
                    <>
                        <Separator />
                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-muted-foreground">Revoked Tokens</Label>
                            {revoked.map((token) => (
                                <div key={token.id} className="flex items-center gap-3 rounded-lg border border-dashed px-4 py-3 opacity-50">
                                    <KeyRound className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="text-sm line-through">{token.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Revoked {token.revoked_at ? new Date(token.revoked_at).toLocaleDateString() : ''}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <Separator />

                <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="font-medium text-foreground text-xs uppercase">MCP Server Details</p>
                    <div className="rounded-md bg-muted px-3 py-2 font-mono text-xs">
                        https://whatthehellhaveidone.net/mcp/whhid
                    </div>
                    <p className="text-xs">
                        Use this URL and your token in your AI assistant's MCP configuration.{' '}
                        <a href="/docs/mcp-setup" className="underline hover:text-foreground">Setup guide →</a>
                    </p>
                </div>
            </div>
        </>
    );
}
