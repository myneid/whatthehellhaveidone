import { router, useForm } from '@inertiajs/react';
import { Github, MessageSquare, RefreshCw, Trash2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import * as discord from '@/routes/discord';
import * as github from '@/routes/github';
import * as boardImport from '@/routes/boards/import';
import type { Board, DiscordWebhook, GithubAccount, GithubRepository } from '@/types/app';

type ConnectedRepo = GithubRepository & {
    pivot?: { sync_direction: string; id: number };
    board_github_repository_id?: number;
};

type Props = {
    board: Board;
    githubAccounts: GithubAccount[];
    open: boolean;
    onClose: () => void;
};

function GitHubSection({ board, githubAccounts }: { board: Board; githubAccounts: GithubAccount[] }) {
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
    const [selectedRepoId, setSelectedRepoId] = useState<number | null>(null);
    const [connecting, setConnecting] = useState(false);

    const connectedRepos = (board.github_repositories as ConnectedRepo[] | undefined) ?? [];
    const activeAccounts = githubAccounts.filter((a) => !a.revoked_at);

    const selectedAccount = activeAccounts.find((a) => a.id === selectedAccountId) ?? activeAccounts[0];
    const allRepos = selectedAccount?.repositories ?? [];
    const connectedRepoIds = new Set(connectedRepos.map((r) => r.id));

    function syncRepos() {
        if (!selectedAccount) return;
        router.post(github.syncRepos({ githubAccount: selectedAccount.id }).url, {}, { preserveScroll: true });
    }

    function connectRepo() {
        if (!selectedRepoId) return;
        setConnecting(true);
        router.post(
            github.connectRepository(board).url,
            { github_repository_id: selectedRepoId, sync_direction: 'two_way' },
            { preserveScroll: true, onFinish: () => { setConnecting(false); setSelectedRepoId(null); } },
        );
    }

    function disconnectRepo(boardGithubRepositoryId: number) {
        router.delete(
            github.disconnectRepository({ board: board.id, boardGithubRepository: boardGithubRepositoryId }).url,
            { preserveScroll: true },
        );
    }

    function importIssues(repoId: number) {
        router.post(
            github.importIssues(board).url,
            { github_repository_id: repoId, state: 'open' },
            { preserveScroll: true },
        );
    }

    if (activeAccounts.length === 0) {
        return (
            <div className="space-y-2">
                <p className="text-sm text-muted-foreground">No GitHub account connected.</p>
                <Button size="sm" variant="outline" asChild>
                    <a href={github.redirect().url}>
                        <Github className="mr-2 h-4 w-4" />
                        Connect GitHub
                    </a>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Connected repos */}
            {connectedRepos.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Connected Repositories</p>
                    {connectedRepos.map((repo) => (
                        <div key={repo.id} className="flex items-center justify-between rounded-md border px-3 py-2">
                            <div>
                                <p className="text-sm font-medium">{repo.full_name}</p>
                                <p className="text-xs text-muted-foreground capitalize">
                                    {repo.pivot?.sync_direction?.replace(/_/g, ' ') ?? 'two-way sync'}
                                </p>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    title="Import open issues as cards"
                                    onClick={() => importIssues(repo.id)}
                                >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() => disconnectRepo(repo.pivot?.id ?? repo.id)}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Connect new repo */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-medium uppercase text-muted-foreground">Connect a Repository</p>
                    <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" onClick={syncRepos} title="Sync repositories from GitHub">
                        <RefreshCw className="mr-1 h-3 w-3" />
                        Sync
                    </Button>
                </div>
                {activeAccounts.length > 1 && (
                    <select
                        value={selectedAccountId ?? activeAccounts[0]?.id}
                        onChange={(e) => { setSelectedAccountId(Number(e.target.value)); setSelectedRepoId(null); }}
                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                    >
                        {activeAccounts.map((a) => (
                            <option key={a.id} value={a.id}>@{a.login}</option>
                        ))}
                    </select>
                )}
                <select
                    value={selectedRepoId ?? ''}
                    onChange={(e) => setSelectedRepoId(Number(e.target.value) || null)}
                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                >
                    <option value="">Select a repository…</option>
                    {allRepos
                        .filter((r) => !connectedRepoIds.has(r.id))
                        .map((r) => (
                            <option key={r.id} value={r.id}>{r.full_name}</option>
                        ))}
                </select>
                <Button
                    size="sm"
                    onClick={connectRepo}
                    disabled={!selectedRepoId || connecting}
                    className="w-full"
                >
                    <Github className="mr-2 h-4 w-4" />
                    Connect Repository
                </Button>
            </div>
        </div>
    );
}

function DiscordSection({ board }: { board: Board }) {
    const webhook = board.discord_webhook as DiscordWebhook | null | undefined;
    const form = useForm({
        name: webhook?.name ?? '',
        webhook_url: '',
        events: webhook?.events ?? ['card.created', 'card.moved'],
    });

    function save(e: React.FormEvent) {
        e.preventDefault();
        if (webhook) {
            form.put(discord.update(board).url, { preserveScroll: true });
        } else {
            form.post(discord.store(board).url, { preserveScroll: true });
        }
    }

    function remove() {
        router.delete(discord.destroy(board).url, { preserveScroll: true });
    }

    function sendTest() {
        router.post(discord.test(board).url, {}, { preserveScroll: true });
    }

    return (
        <form onSubmit={save} className="space-y-3">
            <div className="space-y-1">
                <Label htmlFor="discord-name">Webhook Name</Label>
                <Input
                    id="discord-name"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    placeholder="e.g. #dev-updates"
                />
            </div>
            {!webhook && (
                <div className="space-y-1">
                    <Label htmlFor="discord-url">Webhook URL</Label>
                    <Input
                        id="discord-url"
                        value={form.data.webhook_url}
                        onChange={(e) => form.setData('webhook_url', e.target.value)}
                        placeholder="https://discord.com/api/webhooks/…"
                        type="url"
                    />
                    {form.errors.webhook_url && <p className="text-destructive text-xs">{form.errors.webhook_url}</p>}
                </div>
            )}

            <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={form.processing}>
                    {webhook ? 'Update' : 'Save Webhook'}
                </Button>
                {webhook && (
                    <>
                        <Button type="button" size="sm" variant="outline" onClick={sendTest}>
                            Test
                        </Button>
                        <Button type="button" size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={remove}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </>
                )}
            </div>

            {webhook && (
                <p className="text-xs text-muted-foreground">
                    Notifying <strong>{webhook.name}</strong> · {webhook.is_active ? 'Active' : 'Inactive'}
                </p>
            )}
        </form>
    );
}

function TrelloSection({ board }: { board: Board }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) setFileName(file.name);
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        const file = fileRef.current?.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        router.post(boardImport.trello(board).url, formData as any, {
            preserveScroll: true,
            onFinish: () => setUploading(false),
        });
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <p className="text-sm text-muted-foreground">
                Export your Trello board as JSON (Board → Show Menu → More → Print and Export → Export as JSON) and upload it here.
            </p>
            <div
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 transition-colors hover:border-primary/50 hover:bg-muted/30"
                onClick={() => fileRef.current?.click()}
            >
                <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                {fileName ? (
                    <p className="text-sm font-medium">{fileName}</p>
                ) : (
                    <>
                        <p className="text-sm font-medium">Click to select file</p>
                        <p className="text-xs text-muted-foreground">Trello JSON export</p>
                    </>
                )}
                <input
                    ref={fileRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleFile}
                />
            </div>
            <Button type="submit" size="sm" disabled={!fileName || uploading} className="w-full">
                {uploading ? 'Importing…' : 'Import Board'}
            </Button>
        </form>
    );
}

export function BoardSettingsSheet({ board, githubAccounts, open, onClose }: Props) {
    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent className="w-96 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Board Settings</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-8">
                    {/* GitHub */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Github className="h-4 w-4" />
                            <h3 className="font-semibold">GitHub Integration</h3>
                        </div>
                        <GitHubSection board={board} githubAccounts={githubAccounts} />
                    </div>

                    <Separator />

                    {/* Discord */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-indigo-500" />
                            <h3 className="font-semibold">Discord Webhook</h3>
                        </div>
                        <DiscordSection board={board} />
                    </div>

                    <Separator />

                    {/* Trello Import */}
                    <div>
                        <div className="mb-3 flex items-center gap-2">
                            <Upload className="h-4 w-4 text-blue-500" />
                            <h3 className="font-semibold">Import from Trello</h3>
                        </div>
                        <TrelloSection board={board} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
