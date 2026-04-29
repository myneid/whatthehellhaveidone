import { Head } from '@inertiajs/react';
import { Pencil } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { dashboard } from '@/routes';
import * as projectRoutes from '@/routes/projects';
import * as docRoutes from '@/routes/projects/documents';
import * as documentRoutes from '@/routes/documents';
import type { BreadcrumbItem } from '@/types';
import type { Project } from '@/types/app';

type ProjectDocument = {
    id: number;
    title: string;
    slug: string;
    markdown_body: string | null;
    creator?: { name: string } | null;
    last_editor?: { name: string } | null;
    updated_at: string;
};

type Props = {
    document: ProjectDocument;
    project: Project;
};

export default function DocumentShow({ document, project }: Props) {
    return (
        <>
            <Head title={document.title} />

            <div className="mx-auto max-w-3xl px-6 py-8 space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">{document.title}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {document.last_editor
                                ? `Last edited by ${document.last_editor.name}`
                                : document.creator
                                    ? `Created by ${document.creator.name}`
                                    : ''}
                            {' · '}{new Date(document.updated_at).toLocaleDateString()}
                        </p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                        <a href={documentRoutes.edit(document.slug).url}>
                            <Pencil className="mr-1.5 h-3.5 w-3.5" />
                            Edit
                        </a>
                    </Button>
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {document.markdown_body
                        ? <ReactMarkdown>{document.markdown_body}</ReactMarkdown>
                        : <p className="text-muted-foreground italic">This document has no content yet.</p>}
                </div>
            </div>
        </>
    );
}

DocumentShow.layout = (props: Props): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: props.project.name, href: projectRoutes.show(props.project).url },
        { title: 'Documents', href: docRoutes.index(props.project).url },
        { title: props.document.title },
    ],
});
