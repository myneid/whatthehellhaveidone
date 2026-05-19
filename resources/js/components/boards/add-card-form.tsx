import { useForm } from '@inertiajs/react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as cardRoutes from '@/routes/cards';

export function AddCardForm({
    listId,
    onDone,
}: {
    listId: number;
    onDone: () => void;
}) {
    const form = useForm({ title: '', list_id: listId });

    function submit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.data.title.trim()) {
            return;
        }

        form.post(cardRoutes.store().url, {
            onSuccess: () => {
                form.reset();
                onDone();
            },
        });
    }

    return (
        <form onSubmit={submit} className="space-y-2 px-1">
            <Input
                value={form.data.title}
                onChange={(e) => form.setData('title', e.target.value)}
                placeholder="Card title..."
                autoFocus
                onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                        onDone();
                    }
                }}
            />
            <div className="flex gap-1">
                <Button type="submit" size="sm" disabled={form.processing}>
                    Add
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
