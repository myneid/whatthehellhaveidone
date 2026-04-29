import { Head, router, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Check, Copy, KanbanSquare, Mail, Plus, RefreshCw, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useClipboard } from '@/hooks/use-clipboard';
import { dashboard } from '@/routes';
import * as boards from '@/routes/boards';
import * as projectInvitations from '@/routes/projects/invitations/index';
import * as projectMembers from '@/routes/projects/members';
import * as shallowMembers from '@/routes/members';
import * as projects from '@/routes/projects';
import type { BreadcrumbItem } from '@/types';
import type { Board, Project, ProjectInvitation, ProjectMember } from '@/types/app';

type Props = {
    project: Project;
};

function CreateBoardDialog({ open, onClose, projectId }: { open: boolean; onClose: () => void; projectId: number }) {
    const form = useForm({ name: '', description: '', visibility: 'team', project_id: projectId });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(boards.store().url, { onSuccess: onClose });
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Board</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="board-name">Name</Label>
                        <Input
                            id="board-name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="Board name"
                            autoFocus
                        />
                        {form.errors.name && <p className="text-destructive text-sm">{form.errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="board-visibility">Visibility</Label>
                        <select
                            id="board-visibility"
                            value={form.data.visibility}
                            onChange={(e) => form.setData('visibility', e.target.value)}
                            className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                        >
                            <option value="private">Private</option>
                            <option value="team">Team</option>
                            <option value="public">Public</option>
                        </select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={form.processing}>Create Board</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function InviteMemberForm({ project }: { project: Project }) {
    const form = useForm({ email: '', role: 'member' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(projectMembers.store({ project: project.id }).url, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    }

    return (
        <form onSubmit={submit} className="flex gap-2 flex-wrap sm:flex-nowrap">
            <Input
                type="email"
                placeholder="Email address"
                value={form.data.email}
                onChange={(e) => form.setData('email', e.target.value)}
                className="flex-1"
            />
            <select
                value={form.data.role}
                onChange={(e) => form.setData('role', e.target.value)}
                className="border-input bg-background rounded-md border px-3 py-2 text-sm"
            >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
            </select>
            <Button type="submit" size="sm" disabled={form.processing || !form.data.email}>
                <Mail className="mr-1.5 h-4 w-4" />
                Invite
            </Button>
            {form.errors.email && (
                <p className="w-full text-xs text-destructive">{form.errors.email}</p>
            )}
        </form>
    );
}

function PendingInvitations({ project }: { project: Project }) {
    const [copiedText, copy] = useClipboard();
    const [resendingInvitationId, setResendingInvitationId] = useState<number | null>(null);

    function resendInvitation(invitation: ProjectInvitation) {
        router.post(
            projectInvitations.resend({ project: project.id, invitation: invitation.id }).url,
            {},
            {
                preserveScroll: true,
                onStart: () => setResendingInvitationId(invitation.id),
                onFinish: () => setResendingInvitationId(null),
            },
        );
    }

    if ((project.invitations?.length ?? 0) === 0) {
        return null;
    }

    return (
        <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold">Pending invitations</h3>
                    <p className="text-xs text-muted-foreground">See who has been invited, resend the email, or copy their invite link.</p>
                </div>
                <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                    {project.invitations?.length} pending
                </span>
            </div>

            <div className="space-y-2">
                {project.invitations?.map((invitation) => {
                    const copied = copiedText === invitation.accept_url;
                    const isResending = resendingInvitationId === invitation.id;

                    return (
                        <div key={invitation.id} className="flex flex-col gap-3 rounded-lg border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="text-sm font-medium">{invitation.email}</p>
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                                        {invitation.role}
                                    </span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${
                                            invitation.is_expired
                                                ? 'bg-destructive/10 text-destructive'
                                                : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                        }`}
                                    >
                                        {invitation.is_expired ? 'Expired' : 'Pending'}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Invited by {invitation.inviter?.name ?? 'Unknown'}
                                    {invitation.expires_at
                                        ? ` • ${invitation.is_expired ? 'Expired' : 'Expires'} ${new Date(invitation.expires_at).toLocaleDateString()}`
                                        : ''}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        void copy(invitation.accept_url);
                                    }}
                                >
                                    {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
                                    {copied ? 'Copied' : 'Copy link'}
                                </Button>
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={isResending}
                                    onClick={() => resendInvitation(invitation)}
                                >
                                    <RefreshCw className={`mr-1.5 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
                                    {isResending ? 'Resending...' : 'Resend'}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function ProjectShow({ project }: Props) {
    const [showCreateBoard, setShowCreateBoard] = useState(false);

    function removeMember(member: ProjectMember) {
        router.delete(shallowMembers.destroy(member.id).url, { preserveScroll: true });
    }

    return (
        <>
            <Head title={project.name} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Project Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg" style={{ backgroundColor: project.color ?? '#6366f1' }} />
                        <div>
                            <h1 className="text-2xl font-bold">{project.name}</h1>
                            {project.description && (
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>{project.members?.length ?? 0} members</span>
                    </div>
                </div>

                {/* Boards */}
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Boards</h2>
                        <Button size="sm" onClick={() => setShowCreateBoard(true)}>
                            <Plus className="mr-1 h-4 w-4" />
                            New Board
                        </Button>
                    </div>

                    {(project.boards?.length ?? 0) === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <KanbanSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground text-sm">No boards yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {project.boards?.map((board) => (
                                <Link
                                    key={board.id}
                                    href={boards.show(board).url}
                                    className="hover:bg-accent rounded-lg border p-4 transition-colors"
                                    style={board.background_color ? { borderLeftColor: board.background_color, borderLeftWidth: 3 } : {}}
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="font-medium">{board.name}</span>
                                        {board.visibility !== 'team' && (
                                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                                                {board.visibility}
                                            </span>
                                        )}
                                    </div>
                                    {board.description && (
                                        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{board.description}</p>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-muted-foreground">{board.cards_count ?? 0} cards</span>
                                        {board.labels && board.labels.length > 0 && (
                                            <div className="flex gap-1">
                                                {board.labels.slice(0, 4).map((label) => (
                                                    <span
                                                        key={label.id}
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: label.color }}
                                                        title={label.name}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <Separator />

                {/* Members */}
                <div>
                    <div className="mb-4 flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">Members</h2>
                    </div>

                    <div className="mb-4">
                        <p className="mb-2 text-sm text-muted-foreground">
                            Invite someone by email. If they don't have an account yet, they'll receive an invitation link.
                        </p>
                        <InviteMemberForm project={project} />
                    </div>

                    <PendingInvitations project={project} />

                    <div className="space-y-2">
                        {project.members?.map((member) => (
                            <div key={member.id} className="flex items-center justify-between rounded-lg border px-4 py-2.5">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                        {member.user?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{member.user?.name}</p>
                                        <p className="text-xs text-muted-foreground">{member.user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                                        {member.role}
                                    </span>
                                    {member.role !== 'owner' && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                            onClick={() => removeMember(member)}
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CreateBoardDialog open={showCreateBoard} onClose={() => setShowCreateBoard(false)} projectId={project.id} />
        </>
    );
}

ProjectShow.layout = (props: Props): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: props.project.name, href: projects.show(props.project).url },
    ],
});
