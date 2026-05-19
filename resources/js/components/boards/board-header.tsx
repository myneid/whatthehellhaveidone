import { Link } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Board } from '@/types/app';

type BoardHeaderProps = {
    board: Board;
    onOpenSettings: () => void;
};

export function BoardHeader({ board, onOpenSettings }: BoardHeaderProps) {
    return (
        <div
            className="flex items-center gap-3 border-b px-6 py-3"
            style={
                board.background_color
                    ? { borderBottomColor: board.background_color }
                    : {}
            }
        >
            <h1 className="text-xl font-bold">{board.name}</h1>
            {board.visibility && board.visibility !== 'team' && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                    {board.visibility}
                </span>
            )}
            <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/boards/${board.slug}/report`}>Report</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={onOpenSettings}>
                    <Settings className="mr-1.5 h-4 w-4" />
                    Settings
                </Button>
            </div>
        </div>
    );
}
