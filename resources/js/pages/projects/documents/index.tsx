import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileText, Folder, FolderPlus, Github, Plus, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import * as projectRoutes from '@/routes/projects';
import * as docRoutes from '@/routes/projects/documents';
import * as folderRoutes from '@/routes/projects/folders';
import * as documentRoutes from '@/routes/documents';
import * as folderShallowRoutes from '@/routes/folders';
import * as githubDocsRoutes from '@/routes/projects/github-docs';
import type { BreadcrumbItem } from '@/types';
import type { Project } from '@/types/app';

type DocumentFolder = {
    id: number;
    name: string;
    slug: string;
    children?: DocumentFolder[];
};

type ProjectDocument = {
    id: number;
    title: string;
    slug: string;
    markdown_body: string | null;
    document_folder_id: number | null;
    folder?: DocumentFolder | null;
    creator?: { name: string } | null;
    last_editor?: { name: string } | null;
    updated_at: string;
};

type GithubRepo = { id: number; name: string; full_name: string };

type Props = {
    project: Project;
    documents: ProjectDocument[];
    folders: DocumentFolder[];
    filters: { search?: string; folder_id?: string };
    githubRepositories: GithubRepo[];
};

function FolderTree({ folders, selectedId, onSelect, projectId }: {
    folders: DocumentFolder[];
    selectedId: number | null;
    onSelect: (id: number | null) => void;
    projectId: number;
}) {
    function deleteFolder(folder: DocumentFolder) {
        if (!confirm(`Delete folder "${folder.name}"?`)) return;
        router.delete(folderShallowRoutes.destroy(folder.slug).url, { preserveScroll: true });
    }

    return (
        <ul className="space-y-0.5">
            {folders.map((folder) => (
                <li key={folder.id}>
                    <div className={`group flex items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer hover:bg-muted ${selectedId === folder.id ? 'bg-muted font-medium' : ''}`}
                        onClick={() => onSelect(selectedId === folder.id ? null : folder.id)}>
                        <div className="flex items-center gap-1.5 min-w-0">
                            <Folder className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate">{folder.name}</span>
                        </div>
                        <button type="button" onClick={(e) => { e.stopPropagation(); deleteFolder(folder); }}
                            className="hidden group-hover:flex text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                        </button>
                    </div>
                    {folder.children && folder.children.length > 0 && (
                        <div className="ml-4">
                            <FolderTree folders={folder.children} selectedId={selectedId} onSelect={onSelect} projectId={projectId} />
                        </div>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default function DocumentsIndex({ project, documents, folders, filters, githubRepositories }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [selectedFolder, setSelectedFolder] = useState<number | null>(filters.folder_id ? Number(filters.folder_id) : null);
    const [creatingFolder, setCreatingFolder] = useState(false);
    const [creatingDoc, setCreatingDoc] = useState(false);

    const newFolderForm = useForm({ name: '' });
    const newDocForm = useForm({ title: '', document_folder_id: selectedFolder as number | null });

    function applySearch(e: React.FormEvent) {
        e.preventDefault();
        router.get(docRoutes.index(project).url, { search, folder_id: selectedFolder ?? undefined }, { preserveState: true, replace: true });
    }

    function selectFolder(id: number | null) {
        setSelectedFolder(id);
        newDocForm.setData('document_folder_id', id);
        router.get(docRoutes.index(project).url, { search: search || undefined, folder_id: id ?? undefined }, { preserveState: true, replace: true });
    }

    function createFolder(e: React.FormEvent) {
        e.preventDefault();
        newFolderForm.post(folderRoutes.store(project).url, {
            preserveScroll: true,
            onSuccess: () => { newFolderForm.reset(); setCreatingFolder(false); },
        });
    }

    function createDoc(e: React.FormEvent) {
        e.preventDefault();
        newDocForm.post(docRoutes.store(project).url);
    }

    return (
        <>
            <Head title={`${project.name} — Documents`} />

            <div className="flex h-full flex-col">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <h1 className="text-xl font-semibold">Documents</h1>
                        <p className="text-sm text-muted-foreground">{project.name}</p>
                    </div>
                    <Button size="sm" onClick={() => setCreatingDoc(true)}>
                        <Plus className="mr-1.5 h-4 w-4" />
                        New Document
                    </Button>
                </div>

                <div className="flex flex-1 min-h-0">
                    {/* Sidebar */}
                    <div className="w-56 shrink-0 border-r p-3 space-y-3 overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => selectFolder(null)}
                            className={`w-full flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted ${selectedFolder === null ? 'bg-muted font-medium' : ''}`}
                        >
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            All Documents
                        </button>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-medium uppercase text-muted-foreground px-2">Folders</p>
                                <button type="button" onClick={() => setCreatingFolder(true)} className="text-muted-foreground hover:text-foreground">
                                    <FolderPlus className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            {creatingFolder && (
                                <form onSubmit={createFolder} className="mb-1 flex gap-1">
                                    <Input
                                        autoFocus
                                        value={newFolderForm.data.name}
                                        onChange={(e) => newFolderForm.setData('name', e.target.value)}
                                        placeholder="Folder name"
                                        className="h-7 text-xs"
                                    />
                                    <Button type="submit" size="sm" className="h-7 px-2" disabled={newFolderForm.processing}>+</Button>
                                </form>
                            )}

                            <FolderTree folders={folders} selectedId={selectedFolder} onSelect={selectFolder} projectId={project.id} />
                        </div>

                        {githubRepositories.length > 0 && (
                            <div>
                                <p className="text-xs font-medium uppercase text-muted-foreground px-2 mb-1">GitHub</p>
                                <ul className="space-y-0.5">
                                    {githubRepositories.map((repo) => (
                                        <li key={repo.id}>
                                            <Link
                                                href={githubDocsRoutes.show({ project, repository: repo }).url}
                                                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                                            >
                                                <Github className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                                <span className="truncate">{repo.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* New doc form */}
                        {creatingDoc && (
                            <form onSubmit={createDoc} className="rounded-lg border p-4 space-y-3 bg-card">
                                <p className="text-sm font-medium">New Document</p>
                                <Input
                                    autoFocus
                                    value={newDocForm.data.title}
                                    onChange={(e) => newDocForm.setData('title', e.target.value)}
                                    placeholder="Document title"
                                />
                                {newDocForm.errors.title && <p className="text-xs text-destructive">{newDocForm.errors.title}</p>}
                                <div className="flex gap-2">
                                    <Button type="submit" size="sm" disabled={newDocForm.processing || !newDocForm.data.title.trim()}>Create</Button>
                                    <Button type="button" size="sm" variant="ghost" onClick={() => setCreatingDoc(false)}>Cancel</Button>
                                </div>
                            </form>
                        )}

                        {/* Search */}
                        <form onSubmit={applySearch} className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search documents…"
                                    className="pl-8"
                                />
                            </div>
                            <Button type="submit" variant="outline" size="sm">Search</Button>
                        </form>

                        {/* Documents list */}
                        {documents.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-12 text-center">
                                <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">No documents yet. Create one above.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {documents.map((doc) => (
                                    <Link
                                        key={doc.id}
                                        href={documentRoutes.edit(doc.slug).url}
                                        className="flex items-start justify-between rounded-lg border bg-card px-4 py-3 hover:bg-accent transition-colors"
                                    >
                                        <div className="flex items-start gap-3 min-w-0">
                                            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                            <div className="min-w-0">
                                                <p className="font-medium truncate">{doc.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {doc.folder ? <><Folder className="inline h-3 w-3 mr-0.5" />{doc.folder.name} · </> : ''}
                                                    {doc.last_editor ? `Edited by ${doc.last_editor.name}` : doc.creator ? `Created by ${doc.creator.name}` : ''}
                                                    {' · '}{new Date(doc.updated_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

DocumentsIndex.layout = (props: Props): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: props.project.name, href: projectRoutes.show(props.project).url },
        { title: 'Documents' },
    ],
});
