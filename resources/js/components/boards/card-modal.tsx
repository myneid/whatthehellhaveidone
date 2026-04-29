import { router, useForm } from '@inertiajs/react';
import { Calendar, CheckSquare, Image, MessageSquare, Paperclip, Tag, Trash2, User, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import * as cards from '@/routes/cards';
import * as cardAttachments from '@/routes/cards/attachments';
import * as cardComments from '@/routes/cards/comments';
import * as cardLabels from '@/routes/cards/labels';
import * as attachmentRoutes from '@/routes/attachments';
import * as commentRoutes from '@/routes/comments';
import * as checklistItemRoutes from '@/routes/checklist-items';
import type { Board, BoardList, Card, CardAttachment, Label } from '@/types/app';

type Props = {
    card: Card;
    board: Board;
    lists: BoardList[];
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
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function ChecklistProgress({ items }: { items: { is_completed: boolean }[] }) {
    if (items.length === 0) return null;
    const done = items.filter((i) => i.is_completed).length;
    const pct = Math.round((done / items.length) * 100);
    return (
        <div className="flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">{pct}%</span>
        </div>
    );
}

function CommentForm({ cardId }: { cardId: number }) {
    const form = useForm({ body: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(cardComments.store(cardId).url, {
            onSuccess: () => form.reset(),
        });
    }

    return (
        <form onSubmit={submit} className="flex gap-2">
            <Input
                value={form.data.body}
                onChange={(e) => form.setData('body', e.target.value)}
                placeholder="Add a comment..."
                className="flex-1"
            />
            <Button type="submit" size="sm" disabled={form.processing || !form.data.body.trim()}>
                Post
            </Button>
        </form>
    );
}

function LabelPicker({ card, board }: { card: Card; board: Board }) {
    const attachedIds = new Set((card.labels ?? []).map((l) => l.id));

    function toggle(label: Label) {
        if (attachedIds.has(label.id)) {
            router.delete(cardLabels.detach({ card: card.id, label: label.id }).url, { preserveScroll: true });
        } else {
            router.post(cardLabels.attach(card).url, { label_id: label.id }, { preserveScroll: true });
        }
    }

    const boardLabels = board.labels ?? [];
    if (boardLabels.length === 0) return null;

    return (
        <div>
            <p className="mb-1.5 flex items-center gap-1 text-xs font-medium uppercase text-muted-foreground">
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
                            style={{ backgroundColor: label.color, color: '#fff' }}
                            title={active ? `Remove ${label.name}` : `Add ${label.name}`}
                        >
                            {label.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function AttachmentsSection({ card }: { card: Card }) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    function upload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        const data = new FormData();
        data.append('file', file);
        router.post(cardAttachments.store(card).url, data as any, {
            preserveScroll: true,
            onFinish: () => { setUploading(false); if (fileRef.current) fileRef.current.value = ''; },
        });
    }

    function remove(attachment: CardAttachment) {
        router.delete(attachmentRoutes.destroy(attachment).url, { preserveScroll: true });
    }

    const attachments = card.attachments ?? [];
    const images = attachments.filter((a) => a.mime_type?.startsWith('image/'));
    const files = attachments.filter((a) => !a.mime_type?.startsWith('image/'));

    return (
        <div>
            <div className="mb-1.5 flex items-center justify-between">
                <p className="flex items-center gap-1 text-xs font-medium uppercase text-muted-foreground">
                    <Paperclip className="h-3 w-3" /> Attachments
                </p>
                <Button size="sm" variant="outline" className="h-6 px-2 text-xs" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    <Image className="mr-1 h-3 w-3" />
                    {uploading ? 'Uploading…' : 'Add'}
                </Button>
                <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" onChange={upload} />
            </div>

            {images.length > 0 && (
                <div className="mb-2 grid grid-cols-3 gap-1.5">
                    {images.map((img) => (
                        <div key={img.id} className="group relative aspect-video overflow-hidden rounded-md border bg-muted">
                            <img src={img.url ?? ''} alt={img.filename} className="h-full w-full object-cover" />
                            <button
                                type="button"
                                onClick={() => remove(img)}
                                className="absolute right-1 top-1 hidden rounded-full bg-black/60 p-0.5 text-white group-hover:flex"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {files.length > 0 && (
                <div className="space-y-1">
                    {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between rounded-md border px-2 py-1.5 text-xs">
                            <span className="truncate">{file.filename}</span>
                            <button type="button" onClick={() => remove(file)} className="ml-2 shrink-0 text-muted-foreground hover:text-destructive">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function CardModal({ card, board, lists, open, onClose }: Props) {
    const [editingTitle, setEditingTitle] = useState(false);
    const [editingDesc, setEditingDesc] = useState(false);
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description ?? '');

    function saveTitle() {
        if (title !== card.title) {
            router.patch(cards.update(card).url, { title }, { preserveScroll: true });
        }
        setEditingTitle(false);
    }

    function saveDescription() {
        if (description !== (card.description ?? '')) {
            router.patch(cards.update(card).url, { description }, { preserveScroll: true });
        }
        setEditingDesc(false);
    }

    function archiveCard() {
        router.post(cards.archive(card).url, {}, { preserveScroll: true, onSuccess: onClose });
    }

    function deleteComment(commentId: number) {
        router.delete(commentRoutes.destroy(commentId).url, { preserveScroll: true });
    }

    const allChecklistItems = card.checklists?.flatMap((cl) => cl.items ?? []) ?? [];

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                <DialogHeader>
                    {editingTitle ? (
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onBlur={saveTitle}
                            onKeyDown={(e) => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') { setTitle(card.title); setEditingTitle(false); } }}
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
                        {card.list && <span>in <strong>{card.list.name}</strong></span>}
                        {card.priority && card.priority !== 'none' && (
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${PRIORITY_COLORS[card.priority] ?? ''}`}>
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
                    {/* Labels */}
                    <LabelPicker card={card} board={board} />

                    {/* Assignees */}
                    {card.assignees && card.assignees.length > 0 && (
                        <div>
                            <p className="mb-1 flex items-center gap-1 text-xs font-medium uppercase text-muted-foreground">
                                <User className="h-3 w-3" /> Assignees
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {card.assignees.map((user) => (
                                    <div key={user.id} className="flex items-center gap-1.5">
                                        {user.avatar ? (
                                            <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-full" />
                                        ) : (
                                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="text-sm">{user.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div>
                        <p className="mb-1 text-xs font-medium uppercase text-muted-foreground">Description</p>
                        {editingDesc ? (
                            <div className="space-y-2">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={5}
                                    className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={saveDescription}>Save</Button>
                                    <Button size="sm" variant="ghost" onClick={() => { setDescription(card.description ?? ''); setEditingDesc(false); }}>Cancel</Button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="min-h-[3rem] cursor-pointer rounded-md p-2 text-sm hover:bg-muted"
                                onClick={() => setEditingDesc(true)}
                            >
                                {card.description ? (
                                    <p className="whitespace-pre-wrap">{card.description}</p>
                                ) : (
                                    <p className="text-muted-foreground italic">Add a description...</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Checklists */}
                    {card.checklists && card.checklists.length > 0 && (
                        <div>
                            <p className="mb-2 flex items-center gap-1 text-xs font-medium uppercase text-muted-foreground">
                                <CheckSquare className="h-3 w-3" /> Checklists
                            </p>
                            {card.checklists.map((checklist) => (
                                <div key={checklist.id} className="mb-4">
                                    <p className="mb-1 font-medium">{checklist.title}</p>
                                    <ChecklistProgress items={checklist.items ?? []} />
                                    <div className="mt-2 space-y-1">
                                        {checklist.items?.map((item) => (
                                            <div key={item.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={item.is_completed}
                                                    onChange={() => {
                                                        router.patch(
                                                            checklistItemRoutes.toggle(item).url,
                                                            { is_completed: !item.is_completed },
                                                            { preserveScroll: true },
                                                        );
                                                    }}
                                                    className="h-4 w-4 rounded"
                                                />
                                                <span className={`text-sm ${item.is_completed ? 'text-muted-foreground line-through' : ''}`}>
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
                        <p className="mb-2 flex items-center gap-1 text-xs font-medium uppercase text-muted-foreground">
                            <MessageSquare className="h-3 w-3" /> Comments
                        </p>
                        <CommentForm cardId={card.id} />
                        <div className="mt-3 space-y-3">
                            {card.comments?.map((comment) => (
                                <div key={comment.id} className="flex gap-2">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                        {comment.user?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 rounded-lg bg-muted px-3 py-2">
                                        <div className="mb-0.5 flex items-center justify-between">
                                            <span className="text-xs font-medium">{comment.user?.name}</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(comment.created_at).toLocaleDateString()}
                                                </span>
                                                <button
                                                    onClick={() => deleteComment(comment.id)}
                                                    className="text-muted-foreground hover:text-destructive"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm">{comment.body}</p>
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
