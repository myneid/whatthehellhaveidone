import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as boardListRoutes from '@/routes/boards/lists';
import type { Board } from '@/types/app';

export function AddListForm({
    board,
    onDone,
}: {
    board: Board;
    onDone: () => void;
}) {
    const form = useForm({ name: '' });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.data.name.trim()) {
            return;
        }

        form.post(boardListRoutes.store(board).url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                onDone();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-2">
            <Input
                value={form.data.name}
                onChange={(e) => form.setData('name', e.target.value)}
                placeholder="Row name..."
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        onDone();
                    }
                }}
            />
            <div className="flex gap-1">
                <Button type="submit" size="sm" disabled={form.processing}>
                    Add row
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={onDone}
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        </form>
    );
}
