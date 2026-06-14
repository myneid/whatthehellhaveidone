import React from 'react';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { MobileButton } from '@/components/mobile/edge/MobileButton';
import { MobileCard } from '@/components/mobile/edge/MobileCard';
import { MobileShell } from '@/components/mobile/edge/MobileShell';
import * as boards from '@/routes/boards';
import * as projectRoutes from '@/routes/projects';
import type { Board, Project } from '@/types/app';

interface MobileDashboardProps {
    projects: Project[];
    standaloneBoards: Board[];
}

export default function MobileDashboard({ projects, standaloneBoards }: MobileDashboardProps) {
    return (
        <MobileShell>
            <div className="space-y-6">
                <header>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-sm">Welcome back to FrostPulse</p>
                </header>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Projects</h2>
                        <MobileButton size="sm" variant="outline" className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Project
                        </MobileButton>
                    </div>
                    
                    {projects.length === 0 ? (
                        <MobileCard>
                            <p className="text-center text-muted-foreground py-4">No projects found. Create one to get started.</p>
                        </MobileCard>
                    ) : (
                        <div className="grid gap-3">
                            {projects.map((project) => (
                                <Link key={project.id} href={projectRoutes.show(project).url}>
                                    <MobileCard className="cursor-pointer transition-colors active:bg-muted/50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">{project.name}</h3>
                                                <p className="text-xs text-muted-foreground">{project.members_count ?? 0} members</p>
                                            </div>
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                    </MobileCard>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold">Standalone Boards</h2>
                    <div className="grid gap-3">
                        {standaloneBoards.length === 0 ? (
                            <MobileCard>
                                <p className="text-center text-muted-foreground py-4">No standalone boards.</p>
                            </MobileCard>
                        ) : (
                            standaloneBoards.map((board) => (
                                <Link key={board.id} href={boards.show(board).url}>
                                    <MobileCard className="cursor-pointer transition-colors active:bg-muted/50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-semibold">{board.name}</h3>
                                                <p className="text-xs text-muted-foreground">{board.cards_count ?? 0} cards</p>
                                            </div>
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                    </MobileCard>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </MobileShell>
    );
}
