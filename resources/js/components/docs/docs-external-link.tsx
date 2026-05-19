import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

type DocsExternalLinkProps = {
    href: string;
    children: ReactNode;
};

export function DocsExternalLink({ href, children }: DocsExternalLinkProps) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-foreground hover-docs-link"
        >
            {children}
            <ExternalLink className="size-3.5 shrink-0 opacity-60" aria-hidden />
        </a>
    );
}
