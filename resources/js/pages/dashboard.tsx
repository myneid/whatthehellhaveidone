import { Head, Link, useForm } from '@inertiajs/react';
import { FolderOpen, KanbanSquare, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import * as boards from '@/routes/boards';
import * as projects from '@/routes/projects';
import type { Board, Project } from '@/types/app';

type Props = {
    projects: Project[];
    standaloneBoards: Board[];
};

function CreateProjectDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const form = useForm({ name: '', description: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(projects.store().url, { onSuccess: onClose });
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-1">
                        <Label htmlFor="project-name">Name</Label>
                        <Input
                            id="project-name"
                            value={form.data.name}
                            onChange={(e) => form.setData('name', e.target.value)}
                            placeholder="My Project"
                            autoFocus
                        />
                        {form.errors.name && <p className="text-destructive text-sm">{form.errors.name}</p>}
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="project-desc">Description</Label>
                        <Input
                            id="project-desc"
                            value={form.data.description}
                            onChange={(e) => form.setData('description', e.target.value)}
                            placeholder="Optional description"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Create Project
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function CreateBoardDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
    const form = useForm({ name: '', description: '', visibility: 'private' });

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
                            placeholder="My Board"
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
                        <Button variant="outline" type="button" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            Create Board
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function Dashboard({ projects: projectList, standaloneBoards }: Props) {
    const [showCreateProject, setShowCreateProject] = useState(false);
    const [showCreateBoard, setShowCreateBoard] = useState(false);

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Projects */}
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Projects</h2>
                        <Button size="sm" onClick={() => setShowCreateProject(true)}>
                            <Plus className="mr-1 h-4 w-4" />
                            New Project
                        </Button>
                    </div>

                    {projectList.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <FolderOpen className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground text-sm">No projects yet. Create your first project.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {projectList.map((project) => (
                                <Link
                                    key={project.id}
                                    href={projects.show(project).url}
                                    className="hover:bg-accent rounded-lg border p-4 transition-colors"
                                >
                                    <div className="mb-1 flex items-center gap-2">
                                        <div
                                            className="h-3 w-3 rounded-full"
                                            style={{ backgroundColor: project.color ?? '#6366f1' }}
                                        />
                                        <span className="font-medium">{project.name}</span>
                                    </div>
                                    {project.description && (
                                        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                                    )}
                                    <div className="flex gap-3 text-xs text-muted-foreground">
                                        <span>{project.boards?.length ?? 0} boards</span>
                                        <span>{project.members_count ?? 0} members</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Standalone Boards */}
                <div>
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">My Boards</h2>
                        <Button size="sm" variant="outline" onClick={() => setShowCreateBoard(true)}>
                            <Plus className="mr-1 h-4 w-4" />
                            New Board
                        </Button>
                    </div>

                    {standaloneBoards.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <KanbanSquare className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground text-sm">No standalone boards yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {standaloneBoards.map((board) => (
                                <Link
                                    key={board.id}
                                    href={boards.show(board).url}
                                    className="hover:bg-accent rounded-lg border p-4 transition-colors"
                                    style={board.background_color ? { borderLeftColor: board.background_color, borderLeftWidth: 3 } : {}}
                                >
                                    <p className="mb-1 font-medium">{board.name}</p>
                                    <p className="text-xs text-muted-foreground">{board.cards_count ?? 0} cards</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <CreateProjectDialog open={showCreateProject} onClose={() => setShowCreateProject(false)} />
            <CreateBoardDialog open={showCreateBoard} onClose={() => setShowCreateBoard(false)} />
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
