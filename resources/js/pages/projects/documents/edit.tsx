import { Head, router } from '@inertiajs/react';
import MDEditor from '@uiw/react-md-editor';
import { ArrowLeft, Eye, Save } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import * as projectRoutes from '@/routes/projects';
import * as docRoutes from '@/routes/projects/documents';
import * as documentRoutes from '@/routes/documents';
import type { BreadcrumbItem } from '@/types';
import type { Project } from '@/types/app';

type DocumentFolder = { id: number; name: string };

type ProjectDocument = {
    id: number;
    title: string;
    slug: string;
    markdown_body: string | null;
    document_folder_id: number | null;
    updated_at: string;
};

type Props = {
    document: ProjectDocument;
    project: Project & { document_folders?: DocumentFolder[] };
};

export default function DocumentEdit({ document, project }: Props) {
    const [title, setTitle] = useState(document.title);
    const [body, setBody] = useState(document.markdown_body ?? '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function save(immediate = false) {
        if (saveTimer.current) clearTimeout(saveTimer.current);
        const doSave = () => {
            setSaving(true);
            router.put(documentRoutes.update(document).url, { title, markdown_body: body }, {
                preserveScroll: true,
                onSuccess: () => { setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000); },
                onError: () => setSaving(false),
            });
        };
        if (immediate) { doSave(); } else { saveTimer.current = setTimeout(doSave, 2000); }
    }

    useEffect(() => {
        if (body !== (document.markdown_body ?? '') || title !== document.title) { save(); }
        return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    }, [body, title]);

    return (
        <>
            <Head title={`Edit — ${document.title}`} />

            <div className="flex h-full flex-col">
                {/* Toolbar */}
                <div className="flex items-center gap-3 border-b px-4 py-2.5">
                    <Button variant="ghost" size="sm" asChild>
                        <a href={docRoutes.index(project).url}>
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back
                        </a>
                    </Button>

                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 border-none bg-transparent text-lg font-semibold shadow-none focus-visible:ring-0 px-0"
                        placeholder="Untitled document"
                    />

                    <div className="flex items-center gap-2">
                        {saving && <span className="text-xs text-muted-foreground">Saving…</span>}
                        {saved && !saving && <span className="text-xs text-green-600">Saved</span>}
                        <Button size="sm" variant="outline" onClick={() => save(true)} disabled={saving}>
                            <Save className="mr-1.5 h-3.5 w-3.5" />
                            Save
                        </Button>
                        <Button size="sm" variant="ghost" asChild>
                            <a href={documentRoutes.show(document).url} target="_blank" rel="noopener noreferrer">
                                <Eye className="mr-1.5 h-3.5 w-3.5" />
                                Preview
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-1 overflow-hidden" data-color-mode="auto">
                    <MDEditor
                        value={body}
                        onChange={(v) => setBody(v ?? '')}
                        height="100%"
                        style={{ height: '100%', borderRadius: 0, border: 'none' }}
                        preview="edit"
                        hideToolbar={false}
                    />
                </div>
            </div>
        </>
    );
}

DocumentEdit.layout = (props: Props): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: props.project.name, href: projectRoutes.show(props.project).url },
        { title: 'Documents', href: docRoutes.index(props.project).url },
        { title: props.document.title },
    ],
});
