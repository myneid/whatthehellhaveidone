import { useForm } from '@inertiajs/react';
import { Github, Paperclip, X } from 'lucide-react';
import { useEffect, useMemo, useRef } from 'react';
import { MentionTextField } from '@/components/mention-text-field';
import { Button } from '@/components/ui/button';
import { useMentionableMembersForBoard } from '@/hooks/use-board-collaborators';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import type { MentionableUser } from '@/hooks/use-mention-autocomplete';
import * as cardRoutes from '@/routes/cards';
import type { Board, BoardList, GithubRepository } from '@/types/app';

const ATTACHMENT_ACCEPT =
    'image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,video/*,application/zip,application/x-rar-compressed,.csv,.7z,.zip';

type Props = {
    board: Board;
    list: BoardList | null;
    mentionableMembers: MentionableUser[];
    open: boolean;
    onClose: () => void;
};

export function CreateCardDialog({
    board,
    list,
    mentionableMembers,
    open,
    onClose,
}: Props) {
    const effectiveMentionableMembers = useMentionableMembersForBoard(
        board,
        mentionableMembers.length > 0
            ? mentionableMembers
            : (board.mentionable_members ?? []),
        open,
    );
    const repositories = useMemo(
        () => board.github_repositories ?? [],
        [board.github_repositories],
    );
    const hasConnectedRepository = repositories.length > 0;
    const fileRef = useRef<HTMLInputElement>(null);

    const form = useForm({
        title: '',
        description: '',
        list_id: list?.id ?? 0,
        create_github_issue: false,
        github_repository_id: repositories[0]?.id ?? null,
        attachments: [] as File[],
    });

    useEffect(() => {
        if (!open) {
            return;
        }

        form.setData({
            title: '',
            description: '',
            list_id: list?.id ?? 0,
            create_github_issue: false,
            github_repository_id: repositories[0]?.id ?? null,
            attachments: [],
        });
        form.clearErrors();
    }, [open, list?.id, repositories]);

    function handleClose() {
        if (form.processing) {
            return;
        }

        form.reset();
        form.clearErrors();
        onClose();
    }

    function addFiles(e: React.ChangeEvent<HTMLInputElement>) {
        const selected = Array.from(e.target.files ?? []);

        if (selected.length > 0) {
            form.setData('attachments', [...form.data.attachments, ...selected]);
        }

        e.target.value = '';
    }

    function removeFile(index: number) {
        form.setData(
            'attachments',
            form.data.attachments.filter((_, i) => i !== index),
        );
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.data.title.trim() || !list) {
            return;
        }

        form.transform((data) => ({
            ...data,
            list_id: list.id,
        }));

        form.post(cardRoutes.store().url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="max-w-md">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Create card</DialogTitle>
                        <DialogDescription>
                            {list
                                ? `Add a new card to ${list.name}.`
                                : 'Add a new card to this list.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="create-card-title"
                                className="text-xs font-medium uppercase text-muted-foreground"
                            >
                                Title
                            </label>
                            <Input
                                id="create-card-title"
                                value={form.data.title}
                                onChange={(e) =>
                                    form.setData('title', e.target.value)
                                }
                                placeholder="What needs to be done?"
                                autoFocus
                            />
                            {form.errors.title && (
                                <p className="text-xs text-destructive">
                                    {form.errors.title}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label
                                htmlFor="create-card-description"
                                className="text-xs font-medium uppercase text-muted-foreground"
                            >
                                Description
                            </label>
                            <MentionTextField
                                multiline
                                id="create-card-description"
                                members={effectiveMentionableMembers}
                                value={form.data.description}
                                onValueChange={(description) =>
                                    form.setData('description', description)
                                }
                                placeholder="Optional details... use @ to mention"
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2 rounded-md border bg-muted/30 p-3">
                            <label
                                className={`flex items-start gap-3 ${hasConnectedRepository ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={form.data.create_github_issue}
                                    disabled={!hasConnectedRepository}
                                    onChange={(e) =>
                                        form.setData(
                                            'create_github_issue',
                                            e.target.checked,
                                        )
                                    }
                                    className="mt-1"
                                />
                                <span className="space-y-1">
                                    <span className="flex items-center gap-2 text-sm font-medium">
                                        <Github className="h-4 w-4" />
                                        Create GitHub issue
                                    </span>
                                    <span className="block text-xs text-muted-foreground">
                                        {hasConnectedRepository
                                            ? "Opens a linked issue on GitHub using this card's title and description."
                                            : 'Connect a repository under board settings (gear icon) to enable this.'}
                                    </span>
                                </span>
                            </label>

                            {hasConnectedRepository &&
                                form.data.create_github_issue &&
                                repositories.length > 1 && (
                                    <select
                                        value={
                                            form.data.github_repository_id ??
                                            repositories[0]?.id ??
                                            ''
                                        }
                                        onChange={(e) =>
                                            form.setData(
                                                'github_repository_id',
                                                Number(e.target.value),
                                            )
                                        }
                                        className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                    >
                                        {repositories.map(
                                            (
                                                repository: GithubRepository,
                                            ) => (
                                                <option
                                                    key={repository.id}
                                                    value={repository.id}
                                                >
                                                    {repository.full_name}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                )}
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-medium uppercase text-muted-foreground">
                                    Attachments
                                </label>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    className="h-6 px-2 text-xs"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    <Paperclip className="mr-1 h-3 w-3" />
                                    Add
                                </Button>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    multiple
                                    className="hidden"
                                    accept={ATTACHMENT_ACCEPT}
                                    onChange={addFiles}
                                />
                            </div>

                            {form.data.attachments.length > 0 && (
                                <ul className="space-y-1">
                                    {form.data.attachments.map((file, index) => (
                                        <li
                                            key={`${file.name}-${index}`}
                                            className="flex items-center justify-between gap-2 rounded-md border bg-muted/30 px-2 py-1.5 text-xs"
                                        >
                                            <span className="truncate">
                                                {file.name}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="shrink-0 text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {form.errors.attachments && (
                                <p className="text-xs text-destructive">
                                    {form.errors.attachments}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing || !form.data.title.trim()}
                        >
                            {form.processing ? 'Creating…' : 'Create card'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
