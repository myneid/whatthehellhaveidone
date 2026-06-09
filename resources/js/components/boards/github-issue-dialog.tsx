import { router } from '@inertiajs/react';
import { Github } from 'lucide-react';
import { useMemo, useState } from 'react';
import { openIssue } from '@/actions/App/Http/Controllers/GithubController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Board, Card, GithubRepository } from '@/types/app';

type Props = {
    card: Card | null;
    board: Board;
    open: boolean;
    onClose: () => void;
};

export function GithubIssueDialog({ card, board, open, onClose }: Props) {
    const repositories = useMemo(
        () => board.github_repositories ?? [],
        [board.github_repositories],
    );
    const [repositoryId, setRepositoryId] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    const selectedRepositoryId =
        repositoryId !== ''
            ? Number(repositoryId)
            : (repositories[0]?.id ?? null);

    function handleClose() {
        if (submitting) {
            return;
        }

        setRepositoryId('');
        onClose();
    }

    function submit() {
        if (!card || selectedRepositoryId === null) {
            return;
        }

        setSubmitting(true);

        router.post(
            openIssue(card).url,
            { github_repository_id: selectedRepositoryId },
            {
                preserveScroll: true,
                onFinish: () => {
                    setSubmitting(false);
                    setRepositoryId('');
                    onClose();
                    router.reload({
                        only: ['board'],
                        preserveScroll: true,
                        preserveState: true,
                    });
                },
            },
        );
    }

    const cardLabel = card ? `"${card.title}"` : null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Open a GitHub issue?</DialogTitle>
                    <DialogDescription>
                        {cardLabel
                            ? `${cardLabel} is in To Do. Create a linked GitHub issue so this card can sync with pull requests later.`
                            : 'Create a linked GitHub issue for this card.'}
                    </DialogDescription>
                </DialogHeader>

                {repositories.length > 1 && (
                    <div className="space-y-1.5">
                        <label
                            htmlFor="github-issue-repository"
                            className="text-xs font-medium uppercase text-muted-foreground"
                        >
                            Repository
                        </label>
                        <select
                            id="github-issue-repository"
                            value={repositoryId || String(repositories[0]?.id ?? '')}
                            onChange={(e) => setRepositoryId(e.target.value)}
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                        >
                            {repositories.map((repository: GithubRepository) => (
                                <option key={repository.id} value={repository.id}>
                                    {repository.full_name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                        <Github className="h-4 w-4" />
                        What gets created
                    </span>
                    <p className="mt-2">
                        A GitHub issue using the card title and description. The
                        issue number will appear on the card once it is linked.
                    </p>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={submitting}
                    >
                        Not now
                    </Button>
                    <Button
                        type="button"
                        onClick={submit}
                        disabled={submitting || selectedRepositoryId === null}
                    >
                        {submitting ? 'Creating…' : 'Create issue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
