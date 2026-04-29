import { Head, router, useForm } from '@inertiajs/react';
import { ExternalLink, Github, Plus, Trash2, Unlink } from 'lucide-react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import * as github from '@/routes/github';
import type { GithubAccount } from '@/types/app';

type Props = {
    githubAccounts: GithubAccount[];
};

export default function IntegrationsSettings({ githubAccounts }: Props) {
    const connected = githubAccounts.filter((a) => !('revoked_at' in a && a.revoked_at));

    function disconnectAccount(account: GithubAccount) {
        router.delete(github.destroy(account).url, { preserveScroll: true });
    }

    return (
        <>
            <Head title="Integrations" />

            <div className="space-y-6">
                <Heading variant="small" title="GitHub" description="Connect your GitHub account to sync issues with boards." />

                <div className="rounded-lg border p-4">
                    {connected.length === 0 ? (
                        <div className="flex flex-col items-start gap-3">
                            <p className="text-sm text-muted-foreground">
                                No GitHub accounts connected. Connect one to enable GitHub issue sync on your boards.
                            </p>
                            <Button asChild size="sm">
                                <a href={github.redirect().url}>
                                    <Github className="mr-2 h-4 w-4" />
                                    Connect GitHub Account
                                </a>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {connected.map((account) => (
                                <div key={account.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {account.avatar_url && (
                                            <img
                                                src={account.avatar_url}
                                                alt={account.login}
                                                className="h-8 w-8 rounded-full"
                                            />
                                        )}
                                        <div>
                                            <p className="font-medium">@{account.login}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {account.repositories?.length ?? 0} repositories accessible
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            asChild
                                        >
                                            <a
                                                href={`https://github.com/${account.login}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => disconnectAccount(account)}
                                        >
                                            <Unlink className="mr-1 h-4 w-4" />
                                            Disconnect
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <Separator />

                            <Button asChild size="sm" variant="outline">
                                <a href={github.redirect().url}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Connect Another Account
                                </a>
                            </Button>
                        </div>
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    After connecting, go to a board's settings to link a repository and enable issue sync.
                </p>
            </div>
        </>
    );
}
