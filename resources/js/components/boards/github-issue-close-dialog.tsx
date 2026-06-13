import { router } from '@inertiajs/react';
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { closeIssue } from '@/actions/App/Http/Controllers/GithubController';
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

type Props = {
    card: Card | null;
    open: boolean;
    onClose: () => void;
};

export function GithubIssueCloseDialog({ card, open, onClose }: Props) {
    const [submitting, setSubmitting] = useState(false);

    function handleClose() {
        if (submitting) {
            return;
        }

        onClose();
    }

    function submit() {
        if (!card) {
            return;
        }

        setSubmitting(true);

        router.post(
            closeIssue(card).url,
            {},
            {
                preserveScroll: true,
                onFinish: () => {
                    setSubmitting(false);
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

    const issueNumber = card?.github_link?.issue_number;
    const cardLabel = card
        ? issueNumber
            ? `"${card.title}" (issue #${issueNumber})`
            : `"${card.title}"`
        : null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Close the GitHub issue?</DialogTitle>
                    <DialogDescription>
                        {cardLabel
                            ? `${cardLabel} is in Done. Close the linked issue on GitHub to keep the board in sync.`
                            : 'Close the linked GitHub issue to keep the board in sync.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2 font-medium text-foreground">
                        <CircleCheck className="h-4 w-4" />
                        What happens on GitHub
                    </span>
                    <p className="mt-2">
                        The issue is marked closed. You can reopen it from GitHub
                        or by moving this card out of Done if your workflow
                        supports that.
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
                    <Button type="button" onClick={submit} disabled={submitting}>
                        {submitting ? 'Closing…' : 'Close issue'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
