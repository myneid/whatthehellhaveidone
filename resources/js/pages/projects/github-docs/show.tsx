import { Head, router } from '@inertiajs/react';
import { ChevronDown, ChevronRight, FileText, Github } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { dashboard } from '@/routes';
import * as projectRoutes from '@/routes/projects';
import * as docRoutes from '@/routes/projects/documents';
import * as githubDocsRoutes from '@/routes/projects/github-docs';
import type { BreadcrumbItem } from '@/types';
import type { Project } from '@/types/app';

type GithubFile = { path: string; size: number };

type GithubRepo = { id: number; name: string; full_name: string; html_url: string };

type FileTreeNode = {
    name: string;
    path: string;
    type: 'file' | 'dir';
    children?: FileTreeNode[];
};

type Props = {
    project: Project;
    repository: GithubRepo;
    files: GithubFile[];
    selectedFile: { path: string; content: string } | null;
};

function buildTree(files: GithubFile[]): FileTreeNode[] {
    const root: FileTreeNode[] = [];

    for (const file of files) {
        const parts = file.path.split('/');
        let nodes = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isFile = i === parts.length - 1;
            let existing = nodes.find((n) => n.name === part);

            if (!existing) {
                existing = {
                    name: part,
                    path: parts.slice(0, i + 1).join('/'),
                    type: isFile ? 'file' : 'dir',
                    children: isFile ? undefined : [],
                };
                nodes.push(existing);
            }

            if (!isFile) {
                nodes = existing.children!;
            }
        }
    }

    return root;
}

function FileTreeList({ nodes, selectedPath, onSelect, depth = 0 }: {
    nodes: FileTreeNode[];
    selectedPath: string | null;
    onSelect: (path: string) => void;
    depth?: number;
}) {
    return (
        <ul className="space-y-0.5">
            {nodes.map((node) =>
                node.type === 'dir' ? (
                    <DirNode key={node.path} node={node} selectedPath={selectedPath} onSelect={onSelect} depth={depth} />
                ) : (
                    <li key={node.path}>
                        <button
                            type="button"
                            onClick={() => onSelect(node.path)}
                            className={`w-full flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-left hover:bg-muted ${selectedPath === node.path ? 'bg-muted font-medium' : ''}`}
                            style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
                        >
                            <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="truncate">{node.name}</span>
                        </button>
                    </li>
                )
            )}
        </ul>
    );
}

function DirNode({ node, selectedPath, onSelect, depth }: {
    node: FileTreeNode;
    selectedPath: string | null;
    onSelect: (path: string) => void;
    depth: number;
}) {
    const [open, setOpen] = useState(selectedPath?.startsWith(node.path + '/') ?? depth === 0);

    return (
        <li>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-left hover:bg-muted text-muted-foreground"
                style={{ paddingLeft: `${0.5 + depth * 0.75}rem` }}
            >
                {open ? <ChevronDown className="h-3 w-3 shrink-0" /> : <ChevronRight className="h-3 w-3 shrink-0" />}
                <span className="truncate font-medium">{node.name}</span>
            </button>
            {open && node.children && (
                <FileTreeList nodes={node.children} selectedPath={selectedPath} onSelect={onSelect} depth={depth + 1} />
            )}
        </li>
    );
}

export default function GithubDocsShow({ project, repository, files, selectedFile }: Props) {
    const tree = buildTree(files);

    function selectFile(path: string) {
        router.get(githubDocsRoutes.show({ project, repository }).url, { path }, { preserveState: true, replace: false });
    }

    return (
        <>
            <Head title={`${repository.name} — GitHub Docs`} />

            <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b px-6 py-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Github className="h-4 w-4 text-muted-foreground" />
                            <h1 className="text-xl font-semibold">{repository.name}</h1>
                        </div>
                        <p className="text-sm text-muted-foreground">{repository.full_name}</p>
                    </div>
                    <a
                        href={repository.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:text-foreground"
                    >
                        View on GitHub ↗
                    </a>
                </div>

                <div className="flex flex-1 min-h-0">
                    <div className="w-56 shrink-0 border-r p-3 overflow-y-auto">
                        {files.length === 0 ? (
                            <p className="text-xs text-muted-foreground px-2">No markdown files found.</p>
                        ) : (
                            <FileTreeList nodes={tree} selectedPath={selectedFile?.path ?? null} onSelect={selectFile} />
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {selectedFile ? (
                            <div className="mx-auto max-w-3xl px-6 py-8">
                                <p className="mb-4 font-mono text-xs text-muted-foreground">{selectedFile.path}</p>
                                <div className="prose prose-neutral dark:prose-invert max-w-none">
                                    <ReactMarkdown>{selectedFile.content}</ReactMarkdown>
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full items-center justify-center">
                                <div className="text-center">
                                    <Github className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">Select a file to read it.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

GithubDocsShow.layout = (props: Props): { breadcrumbs: BreadcrumbItem[] } => ({
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: props.project.name, href: projectRoutes.show(props.project).url },
        { title: 'Documents', href: docRoutes.index(props.project).url },
        { title: props.repository.name },
    ],
});
