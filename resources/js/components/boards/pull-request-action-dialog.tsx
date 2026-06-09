import { router } from '@inertiajs/react';
import { GitMerge, GitPullRequestClosed } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { Card } from '@/types/app';
import { resolvePullRequest } from '@/actions/App/Http/Controllers/GithubController';

type Props = {
    card: Card | null;
    open: boolean;
    onClose: () => void;
};

export function PullRequestActionDialog({ card, open, onClose }: Props) {
    const [action, setAction] = useState<'merge' | 'close'>('merge');
    const [submitting, setSubmitting] = useState(false);

    function handleClose() {
        if (submitting) {
            return;
        }

        setAction('merge');
        onClose();
    }

    function submit() {
        if (!card) {
            return;
        }

        setSubmitting(true);

        router.post(
            resolvePullRequest(card).url,
            { action },
            {
                preserveScroll: true,
                onFinish: () => {
                    setSubmitting(false);
                    setAction('merge');
                    onClose();
                },
            },
        );
    }

    const prNumber = card?.github_link?.pull_request_number;
    const cardLabel = card
        ? prNumber
            ? `"${card.title}" (PR #${prNumber})`
            : `"${card.title}"`
        : null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>What should happen to the pull request?</DialogTitle>
                    <DialogDescription>
                        {cardLabel
                            ? `${cardLabel} is in Done. Choose whether to merge or close the pull request on GitHub.`
                            : 'Choose what should happen to the linked pull request on GitHub.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-2">
                    <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 has-checked:border-primary has-checked:bg-muted/50">
                        <input
                            type="radio"
                            name="pull-request-action"
                            value="merge"
                            checked={action === 'merge'}
                            onChange={() => setAction('merge')}
                            className="mt-1"
                        />
                        <span className="space-y-1">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                <GitMerge className="h-4 w-4" />
                                Merge pull request
                            </span>
                            <span className="block text-xs text-muted-foreground">
                                Merges into the base branch on GitHub. Linked
                                issues are usually closed automatically.
                            </span>
                        </span>
                    </label>

                    <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 has-checked:border-primary has-checked:bg-muted/50">
                        <input
                            type="radio"
                            name="pull-request-action"
                            value="close"
                            checked={action === 'close'}
                            onChange={() => setAction('close')}
                            className="mt-1"
                        />
                        <span className="space-y-1">
                            <span className="flex items-center gap-2 text-sm font-medium">
                                <GitPullRequestClosed className="h-4 w-4" />
                                Close pull request
                            </span>
                            <span className="block text-xs text-muted-foreground">
                                Closes without merging. Use when the work should
                                not be shipped.
                            </span>
                        </span>
                    </label>
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
                        disabled={submitting}
                    >
                        {submitting ? 'Saving…' : 'Apply'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
