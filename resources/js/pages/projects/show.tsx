import { Head, useForm } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { KanbanSquare, Plus, Users } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import * as boards from '@/routes/boards';
import * as projects from '@/routes/projects';
import type { BreadcrumbItem } from '@/types';
import type { Board, Project } from '@/types/app';

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

export default function ProjectShow({ project }: Props) {
    const [showCreateBoard, setShowCreateBoard] = useState(false);

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

                {/* Members */}
                {project.members && project.members.length > 0 && (
                    <div>
                        <h2 className="mb-3 text-lg font-semibold">Members</h2>
                        <div className="flex flex-wrap gap-3">
                            {project.members.map((member) => (
                                <div key={member.id} className="flex items-center gap-2 rounded-lg border px-3 py-2">
                                    {member.user?.avatar ? (
                                        <img src={member.user.avatar} alt={member.user.name} className="h-6 w-6 rounded-full" />
                                    ) : (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                            {member.user?.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="text-sm">{member.user?.name}</span>
                                    <span className="text-xs text-muted-foreground capitalize">{member.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
