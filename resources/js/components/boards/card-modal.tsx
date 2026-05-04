import { router, useForm } from '@inertiajs/react';
import {
    ArrowRight,
    Calendar,
    CheckSquare,
    ExternalLink,
    Image,
    MessageSquare,
    Paperclip,
    Tag,
    Trash2,
    User,
    X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import * as githubController from '@/actions/App/Http/Controllers/GithubController';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import * as attachmentRoutes from '@/routes/attachments';
import * as cards from '@/routes/cards';
import * as cardAttachments from '@/routes/cards/attachments';
import * as cardComments from '@/routes/cards/comments';
import * as cardLabels from '@/routes/cards/labels';
import * as checklistItemRoutes from '@/routes/checklist-items';
import * as commentRoutes from '@/routes/comments';
import type {
    Board,
    BoardList,
    Card,
    CardAttachment,
    Label,
} from '@/types/app';

type Props = {
    card: Card;
    board: Board;
    lists: BoardList[];
    isMoving: boolean;
    onMoveToList: (list: BoardList) => void;
    open: boolean;
    onClose: () => void;
};

const PRIORITY_COLORS: Record<string, string> = {
    none: 'bg-gray-100 text-gray-700',
    low: 'bg-blue-100 text-blue-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
};

function formatDate(dateStr: string | null): string {
    if (!dateStr) {
        return '';
    }

    return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

function ChecklistProgress({ items }: { items: { is_completed: boolean }[] }) {
    if (items.length === 0) {
        return null;
    }

    const done = items.filter((i) => i.is_completed).length;
    const pct = Math.round((done / items.length) * 100);

    return (
        <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-muted">
                <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs text-muted-foreground">{pct}%</span>
        </div>
    );
}

function CommentForm({
    cardId,
    boardMembers,
}: {
    cardId: number;
    boardMembers: { id: number; name: string }[];
}) {
    const form = useForm({ body: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(cardComments.store(cardId).url, {
            onSuccess: () => form.reset(),
        });
    }

    return (
        <div className="space-y-1.5">
            <form onSubmit={submit} className="flex gap-2">
                <Input
                    value={form.data.body}
                    onChange={(e) => form.setData('body', e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1"
                />
                <Button
                    type="submit"
                    size="sm"
                    disabled={form.processing || !form.data.body.trim()}
                >
                    Post
                </Button>
            </form>
            {boardMembers.length > 0 && (
                <p className="text-xs text-muted-foreground">
                    Mention someone with @
                    {boardMembers.map((m) => m.name).join(', @')}
                </p>
            )}
        </div>
    );
}

function LabelPicker({ card, board }: { card: Card; board: Board }) {
    const attachedIds = new Set((card.labels ?? []).map((l) => l.id));

    function toggle(label: Label) {
        if (attachedIds.has(label.id)) {
            router.delete(
                cardLabels.detach({ card: card.id, label: label.id }).url,
                { preserveScroll: true },
            );
        } else {
            router.post(
                cardLabels.attach(card).url,
                { label_id: label.id },
                { preserveScroll: true },
            );
        }
    }

    const boardLabels = board.labels ?? [];

    if (boardLabels.length === 0) {
        return null;
    }

    return (
        <div>
            <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase">
                <Tag className="h-3 w-3" /> Labels
            </p>
            <div className="flex flex-wrap gap-1.5">
                {boardLabels.map((label) => {
                    const active = attachedIds.has(label.id);

                    return (
                        <button
                            key={label.id}
                            type="button"
                            onClick={() => toggle(label)}
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity ${active ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
                            style={{
                                backgroundColor: label.color,
                                color: '#fff',
                            }}
                            title={
                                active
                                    ? `Remove ${label.name}`
                                    : `Add ${label.name}`
                            }
                        >
                            {label.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function GitHubIssueSection({ card }: { card: Card }) {
    const link = card.github_link;
    const [assigning, setAssigning] = useState(false);

    if (!link) {
        return null;
    }

    function assignToCopilot() {
        setAssigning(true);
        router.post(
            githubController.assignToCopilot(card).url,
            {},
            {
                preserveScroll: true,
                onFinish: () => setAssigning(false),
            },
        );
    }

    return (
        <div>
            <p className="mb-1.5 flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase">
                <svg
                    className="h-3 w-3"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub Issue
            </p>
            <div className="flex items-center gap-2">
                <a
                    href={link.issue_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm transition-colors hover:bg-muted"
                    onClick={(e) => e.stopPropagation()}
                >
                    <span className="font-medium">#{link.issue_number}</span>
                    <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                            link.state === 'open'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700'
                        }`}
                    >
                        {link.state}
                    </span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-7 px-2 text-xs"
                    onClick={assignToCopilot}
                    disabled={assigning}
                    title="Assign this issue to the GitHub Copilot coding agent"
                >
                    {assigning ? 'Assigning…' : 'Assign to Copilot'}
                </Button>
            </div>
        </div>
    );
}

function AttachmentsSection({ card }: { card: Card }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [previewImage, setPreviewImage] = useState<CardAttachment | null>(null);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(
        null,
    );

    function clearPending() {
        if (pendingPreviewUrl) {
            URL.revokeObjectURL(pendingPreviewUrl);
        }

        setPendingFile(null);
        setPendingPreviewUrl(null);

        if (fileRef.current) {
            fileRef.current.value = '';
        }
    }

    function selectFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        if (pendingPreviewUrl) {
            URL.revokeObjectURL(pendingPreviewUrl);
        }

        setPendingFile(file);
        setPendingPreviewUrl(
            file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
        );
    }

    function uploadPendingFile() {
        if (!pendingFile) {
            return;
        }

        setUploading(true);
        const data = new FormData();
        data.append('file', pendingFile);
        router.post(cardAttachments.store(card).url, data as any, {
            preserveScroll: true,
            onFinish: () => {
                setUploading(false);
                clearPending();
            },
        });
    }

    function remove(attachment: CardAttachment) {
        router.delete(attachmentRoutes.destroy(attachment).url, {
            preserveScroll: true,
        });
    }

    const attachments = card.attachments ?? [];
    const images = attachments.filter((a) => a.mime_type?.startsWith('image/'));
    const files = attachments.filter((a) => !a.mime_type?.startsWith('image/'));

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase">
                    <Paperclip className="h-3 w-3" /> Attachments
                </p>
                <Button
                    size="sm"
                    variant="outline"
                    className="h-6 px-2 text-xs"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                >
                    <Image className="mr-1 h-3 w-3" />
                    {pendingFile ? 'Replace' : 'Add'}
                </Button>
                <input
                    ref={fileRef}
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                    onChange={selectFile}
                />
            </div>

            {pendingFile && (
                <div className="mb-2 space-y-2 rounded-md border bg-muted/30 p-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                        Preview before saving
                    </p>

                    {pendingPreviewUrl ? (
                        <div className="overflow-hidden rounded-md border bg-background">
                            <img
                                src={pendingPreviewUrl}
                                alt={pendingFile.name}
                                className="max-h-56 w-full object-contain"
                            />
                        </div>
                    ) : (
                        <div className="rounded-md border bg-background px-2 py-1.5 text-xs">
                            <p className="truncate font-medium">
                                {pendingFile.name}
                            </p>
                            <p className="text-muted-foreground">
                                {(pendingFile.size / 1024).toFixed(1)} KB
                            </p>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={clearPending}
                            disabled={uploading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            onClick={uploadPendingFile}
                            disabled={uploading}
                        >
                            {uploading ? 'Uploading…' : 'Save'}
                        </Button>
                    </div>
                </div>
            )}

            {images.length > 0 && (
                <div className="mb-2 grid grid-cols-3 gap-1.5">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="group relative aspect-video overflow-hidden rounded-md border bg-muted"
                        >
                            <button
                                type="button"
                                className="h-full w-full"
                                onClick={() => setPreviewImage(img)}
                                title="Open image preview"
                            >
                                <img
                                    src={img.url ?? ''}
                                    alt={img.filename}
                                    className="h-full w-full object-cover"
                                />
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    remove(img);
                                }}
                                className="absolute top-1 right-1 hidden rounded-full bg-black/60 p-0.5 text-white group-hover:flex"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <Dialog
                open={previewImage !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setPreviewImage(null);
                    }
                }}
            >
                <DialogContent className="w-[95vw] max-w-5xl p-2 sm:p-4">
                    {previewImage && (
                        <div className="space-y-2">
                            <DialogHeader>
                                <DialogTitle className="truncate text-sm">
                                    {previewImage.filename}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="max-h-[80vh] overflow-auto rounded-md border bg-muted/20 p-1">
                                <img
                                    src={previewImage.url ?? ''}
                                    alt={previewImage.filename}
                                    className="mx-auto h-auto max-h-[75vh] w-auto max-w-full object-contain"
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {files.length > 0 && (
                <div className="space-y-1">
                    {files.map((file) => (
                        <div
                            key={file.id}
                            className="flex items-center justify-between rounded-md border px-2 py-1.5 text-xs"
                        >
                            <span className="truncate">{file.filename}</span>
                            <button
                                type="button"
                                onClick={() => remove(file)}
                                className="ml-2 shrink-0 text-muted-foreground hover:text-destructive"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function MoveCardSection({
    card,
    lists,
    isMoving,
    onMoveToList,
}: Pick<Props, 'card' | 'lists' | 'isMoving' | 'onMoveToList'>) {
    if (lists.length < 2) {
        return null;
    }

    const currentIndex = lists.findIndex((list) => list.id === card.list_id);
    const visibleDestinations = lists.filter(
        (list) => list.id !== card.list_id,
    );

    if (visibleDestinations.length === 0) {
        return null;
    }

    const obviousDestination =
        currentIndex >= 0
            ? (lists[currentIndex + 1] ?? lists[currentIndex - 1] ?? null)
            : (visibleDestinations[0] ?? null);
    const secondaryDestinations = visibleDestinations.filter(
        (list) => list.id !== obviousDestination?.id,
    );

    return (
        <div className="rounded-xl border bg-muted/30 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase">
                    <ArrowRight className="h-3 w-3" /> Move to
                </p>
                {obviousDestination ? (
                    <Button
                        size="sm"
                        onClick={() => onMoveToList(obviousDestination)}
                        disabled={isMoving}
                    >
                        {isMoving
                            ? 'Moving…'
                            : `Move to ${obviousDestination.name}`}
                    </Button>
                ) : null}
            </div>

            {secondaryDestinations.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                    {secondaryDestinations.map((list) => (
                        <Button
                            key={list.id}
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => onMoveToList(list)}
                            disabled={isMoving}
                        >
                            {list.name}
                        </Button>
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export function CardModal({
    card,
    board,
    lists,
    isMoving,
    onMoveToList,
    open,
    onClose,
}: Props) {
    const boardMembers = (board.members ?? [])
        .map((m) => ({ id: m.user?.id ?? 0, name: m.user?.name ?? '' }))
        .filter((m) => m.id);
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDesc, setEditingDesc] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description ?? '');

    function saveTitle() {
        if (title !== card.title) {
            router.patch(
                cards.update(card).url,
                { title },
                { preserveScroll: true },
            );
        }

        setEditingTitle(false);
    }

    function saveDescription() {
        if (description !== (card.description ?? '')) {
            router.patch(
                cards.update(card).url,
                { description },
                { preserveScroll: true },
            );
        }

        setEditingDesc(false);
    }

    function archiveCard() {
        router.post(
            cards.archive(card).url,
            {},
            { preserveScroll: true, onSuccess: onClose },
        );
    }

    function deleteComment(commentId: number) {
        router.delete(commentRoutes.destroy(commentId).url, {
            preserveScroll: true,
        });
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    {editingTitle ? (
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={saveTitle}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    saveTitle();
                                }

                                if (e.key === 'Escape') {
                                    setTitle(card.title);
                                    setEditingTitle(false);
                                }
                            }}
                            className="w-full rounded border px-2 py-1 text-xl font-semibold"
                            autoFocus
                        />
                    ) : (
                        <DialogTitle
                            className="cursor-pointer text-xl hover:underline"
                            onClick={() => setEditingTitle(true)}
                        >
                            {card.title}
                        </DialogTitle>
                    )}

                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        {card.creator && (
                            <span>
                                Created by <strong>{card.creator.name}</strong>
                            </span>
                        )}
                        {card.list && (
                            <span>
                                in <strong>{card.list.name}</strong>
                            </span>
                        )}
                        {card.priority && card.priority !== 'none' && (
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_COLORS[card.priority] ?? ''}`}
                            >
                                {card.priority}
                            </span>
                        )}
                        {card.due_at && (
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(card.due_at)}
                            </span>
                        )}
                    </div>
                </DialogHeader>

                <div className="mt-2 space-y-6">
                    <MoveCardSection
                        card={card}
                        lists={lists}
                        isMoving={isMoving}
                        onMoveToList={onMoveToList}
                    />

                    {/* Labels */}
                    <LabelPicker card={card} board={board} />

                    {/* Assignees */}
                    {card.assignees && card.assignees.length > 0 && (
                        <div>
                            <p className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase">
                                <User className="h-3 w-3" /> Assignees
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {card.assignees.map((user) => (
                                    <div
                                        key={user.id}
                                        className="flex items-center gap-1.5"
                                    >
                                        {user.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className="h-6 w-6 rounded-full"
                                            />
                                        ) : (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                                {user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}
                                        <span className="text-sm">
                                            {user.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* GitHub Issue */}
                    <GitHubIssueSection card={card} />

                    {/* Description */}
                    <div>
                        <p className="mb-1 text-xs font-medium text-muted-foreground uppercase">
                            Description
                        </p>
                        {editingDesc ? (
                            <div className="space-y-2">
                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={5}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={saveDescription}>
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                            setDescription(
                                                card.description ?? '',
                                            );
                                            setEditingDesc(false);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="min-h-[3rem] cursor-pointer rounded-md p-2 text-sm hover:bg-muted"
                                onClick={() => setEditingDesc(true)}
                            >
                                {card.description ? (
                                    <p className="whitespace-pre-wrap">
                                        {card.description}
                                    </p>
                                ) : (
                                    <p className="text-muted-foreground italic">
                                        Add a description...
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Checklists */}
                    {card.checklists && card.checklists.length > 0 && (
                        <div>
                            <p className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase">
                                <CheckSquare className="h-3 w-3" /> Checklists
                            </p>
                            {card.checklists.map((checklist) => (
                                <div key={checklist.id} className="mb-4">
                                    <p className="mb-1 font-medium">
                                        {checklist.title}
                                    </p>
                                    <ChecklistProgress
                                        items={checklist.items ?? []}
                                    />
                                    <div className="mt-2 space-y-1">
                                        {checklist.items?.map((item) => (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={item.is_completed}
                                                    onChange={() => {
                                                        router.patch(
                                                            checklistItemRoutes.toggle(
                                                                item,
                                                            ).url,
                                                            {
                                                                is_completed:
                                                                    !item.is_completed,
                                                            },
                                                            {
                                                                preserveScroll: true,
                                                            },
                                                        );
                                                    }}
                                                    className="h-4 w-4 rounded"
                                                />
                                                <span
                                                    className={`text-sm ${item.is_completed ? 'text-muted-foreground line-through' : ''}`}
                                                >
                                                    {item.title}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Attachments */}
                    <AttachmentsSection card={card} />

                    {/* Comments */}
                    <div>
                        <p className="mb-2 flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase">
                            <MessageSquare className="h-3 w-3" /> Comments
                        </p>
                        <CommentForm
                            cardId={card.id}
                            boardMembers={boardMembers}
                        />
                        <div className="mt-3 space-y-3">
                            {card.comments?.map((comment) => (
                                <div key={comment.id} className="flex gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                        {comment.user?.name
                                            .charAt(0)
                                            .toUpperCase()}
                                    </div>
                                    <div className="flex-1 rounded-lg bg-muted px-3 py-2">
                                        <div className="mb-0.5 flex items-center justify-between">
                                            <span className="text-xs font-medium">
                                                {comment.user?.name}
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        comment.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        deleteComment(
                                                            comment.id,
                                                        )
                                                    }
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm">
                                            {comment.body}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t pt-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={archiveCard}
                            className="text-destructive hover:text-destructive"
                        >
                            <Trash2 className="mr-1 h-4 w-4" />
                            Archive card
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
