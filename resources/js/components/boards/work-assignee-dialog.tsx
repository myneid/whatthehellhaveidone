import { router } from '@inertiajs/react';
import { Bot, User } from 'lucide-react';
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
import { assignWork } from '@/actions/App/Http/Controllers/GithubController';

export type AssignableMember = {
    id: number;
    name: string;
    avatar: string | null;
};

type Props = {
    card: Card | null;
    assignableMembers: AssignableMember[];
    open: boolean;
    onClose: () => void;
};

export function WorkAssigneeDialog({
    card,
    assignableMembers,
    open,
    onClose,
}: Props) {
    const [mode, setMode] = useState<'copilot' | 'user'>('copilot');
    const [userId, setUserId] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    function handleClose() {
        if (submitting) {
            return;
        }

        setMode('copilot');
        setUserId('');
        onClose();
    }

    function submit() {
        if (!card) {
            return;
        }

        if (mode === 'user' && !userId) {
            return;
        }

        setSubmitting(true);

        router.post(
            assignWork(card).url,
            {
                mode,
                user_id: mode === 'user' ? Number(userId) : null,
            },
            {
                preserveScroll: true,
                onFinish: () => {
                    setSubmitting(false);
                    setMode('copilot');
                    setUserId('');
                    onClose();
                },
            },
        );
    }

    const canSubmit =
        mode === 'copilot' || (mode === 'user' && userId !== '');

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Who should work on this?</DialogTitle>
                    <DialogDescription>
                        {card
                            ? `Choose how "${card.title}" should be handled after moving to In Progress.`
                            : 'Choose who should work on this card.'}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 has-checked:border-primary has-checked:bg-muted/50">
                            <input
                                type="radio"
                                name="work-mode"
                                value="copilot"
                                checked={mode === 'copilot'}
                                onChange={() => setMode('copilot')}
                                className="mt-1"
                            />
                            <span className="space-y-1">
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <Bot className="h-4 w-4" />
                                    GitHub Copilot
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    Assigns the linked issue to GitHub Copilot and enables
                                    automatic Copilot PR review.
                                </span>
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-start gap-3 rounded-md border p-3 has-checked:border-primary has-checked:bg-muted/50">
                            <input
                                type="radio"
                                name="work-mode"
                                value="user"
                                checked={mode === 'user'}
                                onChange={() => setMode('user')}
                                className="mt-1"
                            />
                            <span className="space-y-1">
                                <span className="flex items-center gap-2 text-sm font-medium">
                                    <User className="h-4 w-4" />
                                    Team member
                                </span>
                                <span className="block text-xs text-muted-foreground">
                                    Assigns on the board only. Copilot review is skipped for this card.
                                </span>
                            </span>
                        </label>
                    </div>

                    {mode === 'user' && (
                        <div className="space-y-1.5">
                            <label
                                htmlFor="work-assignee"
                                className="text-xs font-medium uppercase text-muted-foreground"
                            >
                                Assign to
                            </label>
                            <select
                                id="work-assignee"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                            >
                                <option value="">Select a team member…</option>
                                {assignableMembers.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                            {assignableMembers.length === 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Add board members (non-viewer) before assigning work.
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={submitting}
                    >
                        Skip for now
                    </Button>
                    <Button
                        type="button"
                        onClick={submit}
                        disabled={!canSubmit || submitting}
                    >
                        {submitting ? 'Assigning…' : 'Confirm'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
