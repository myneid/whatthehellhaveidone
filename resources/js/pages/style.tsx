import { Head, Link } from '@inertiajs/react';
import { Palette, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, register } from '@/routes';

const brandColors = [
    {
        name: 'HELL Red',
        token: 'brand-red',
        role: 'Primary actions, focus rings, links',
        className: 'bg-brand-red',
        textClass: 'text-brand-cream',
    },
    {
        name: 'DONE Yellow',
        token: 'brand-yellow',
        role: 'Secondary actions, highlights',
        className: 'bg-brand-yellow',
        textClass: 'text-brand-ink',
    },
    {
        name: 'Cream',
        token: 'brand-cream',
        role: 'Page backgrounds, light surfaces',
        className: 'bg-brand-cream border-2 border-border',
        textClass: 'text-brand-ink',
    },
    {
        name: 'Ink',
        token: 'brand-ink',
        role: 'Text, outlines, comic shadows',
        className: 'bg-brand-ink',
        textClass: 'text-brand-cream',
    },
];

const semanticColors = [
    { name: 'Primary', className: 'bg-primary', text: 'text-primary-foreground' },
    { name: 'Secondary', className: 'bg-secondary', text: 'text-secondary-foreground' },
    { name: 'Accent', className: 'bg-accent', text: 'text-accent-foreground' },
    { name: 'Muted', className: 'bg-muted', text: 'text-muted-foreground' },
    { name: 'Destructive', className: 'bg-destructive', text: 'text-destructive-foreground' },
];

function Section({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-xl font-bold tracking-tight">{title}</h2>
                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            {children}
        </section>
    );
}

function Swatch({
    name,
    token,
    role,
    className,
    textClass,
}: {
    name: string;
    token: string;
    role: string;
    className: string;
    textClass: string;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border-2 border-border shadow-brand-sm transition-brand hover:-translate-y-0.5 hover:border-primary hover:shadow-brand">
            <div className={`flex h-24 items-end p-4 ${className}`}>
                <span className={`text-sm font-bold ${textClass}`}>{name}</span>
            </div>
            <div className="space-y-1 bg-card p-4">
                <p className="font-mono text-xs text-muted-foreground">{token}</p>
                <p className="text-sm text-muted-foreground">{role}</p>
            </div>
        </div>
    );
}

export default function StyleGuide() {
    return (
        <>
            <Head title="Style Guide – What the HELL have I done" />

            <div className="min-h-screen bg-background">
                <header className="sticky top-0 z-10 border-b-2 border-border bg-background/95 backdrop-blur">
                    <div className="mx-auto flex max-w-5xl items-center gap-4 px-6 py-4">
                        <Link href="/" className="shrink-0">
                            <img
                                src="/whatthehellhaveidone.png"
                                alt="What the HELL have i DONE"
                                className="h-14 w-auto"
                            />
                        </Link>
                        <div className="hidden sm:block">
                            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                                <Palette className="size-3.5" />
                                Style Guide
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Brand colors wired into shadcn components
                            </p>
                        </div>
                        <div className="ml-auto flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                                <Link href={login()}>Sign in</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link href={register()}>Get started</Link>
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl space-y-12 px-6 py-10">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                            <Sparkles className="size-3.5" />
                            Logo-driven branding
                        </div>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                            What the <span className="text-primary">HELL</span> have i{' '}
                            <span className="text-secondary-foreground bg-secondary px-2 rounded-lg shadow-brand-sm">
                                DONE
                            </span>
                        </h1>
                        <p className="max-w-2xl text-muted-foreground">
                            Comic-book energy: bold red, golden yellow, warm cream, and ink-black
                            outlines. These tokens flow through buttons, borders, focus rings, and
                            hover states app-wide via shadcn CSS variables.
                        </p>
                    </div>

                    <Section
                        title="Brand palette"
                        description="Core colors extracted from the logo. Use Tailwind utilities like bg-brand-red or semantic tokens like bg-primary."
                    >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {brandColors.map((color) => (
                                <Swatch key={color.token} {...color} />
                            ))}
                        </div>
                    </Section>

                    <Section
                        title="Semantic tokens"
                        description="shadcn maps these to component variants automatically."
                    >
                        <div className="flex flex-wrap gap-3">
                            {semanticColors.map((color) => (
                                <div
                                    key={color.name}
                                    className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-brand-sm ${color.className} ${color.text}`}
                                >
                                    {color.name}
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section
                        title="Buttons"
                        description="Primary = HELL red. Secondary = DONE yellow. Outline hovers pick up the red border."
                    >
                        <div className="flex flex-wrap gap-3">
                            <Button>Primary (HELL)</Button>
                            <Button variant="secondary">Secondary (DONE)</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="link">Link style</Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Button size="sm">Small</Button>
                            <Button size="default">Default</Button>
                            <Button size="lg">Large</Button>
                        </div>
                    </Section>

                    <Section title="Form controls">
                        <div className="grid max-w-md gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="demo-input">Card title</Label>
                                <Input id="demo-input" placeholder="What did you just do?" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="demo-input-focus">Focused state</Label>
                                <Input
                                    id="demo-input-focus"
                                    defaultValue="Hover or tab to see the red ring"
                                />
                            </div>
                        </div>
                    </Section>

                    <Section title="Badges">
                        <div className="flex flex-wrap gap-2">
                            <Badge>Primary</Badge>
                            <Badge variant="secondary">Secondary</Badge>
                            <Badge variant="outline">Outline</Badge>
                            <Badge variant="destructive">Destructive</Badge>
                        </div>
                    </Section>

                    <Section
                        title="Cards & borders"
                        description="Cards use rounded-xl corners and pick up primary border color on hover."
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Card className="hover:-translate-y-0.5 hover:border-primary hover:shadow-brand">
                                <CardHeader>
                                    <CardTitle>Move card to Done</CardTitle>
                                    <CardDescription>
                                        Hover this card — border shifts to HELL red.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        The comic shadow and warm cream background keep things
                                        playful without losing readability.
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button size="sm">Do the thing</Button>
                                </CardFooter>
                            </Card>

                            <Card className="border-secondary/50 bg-secondary/10 hover:-translate-y-0.5 hover:border-secondary hover:shadow-brand">
                                <CardHeader>
                                    <CardTitle className="text-secondary-foreground">
                                        DONE column
                                    </CardTitle>
                                    <CardDescription>
                                        Yellow accent surface for completed work.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        Use secondary tokens when you want the golden highlight
                                        without a full button.
                                    </p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="secondary" size="sm">
                                        Celebrate
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </Section>

                    <Section title="Typography">
                        <div className="space-y-3 rounded-2xl border-2 border-border bg-card p-6 shadow-brand-sm">
                            <p className="text-3xl font-black">Heading — bold & punchy</p>
                            <p className="text-lg font-semibold text-primary">
                                Subheading in HELL red
                            </p>
                            <p className="text-base text-foreground">
                                Body text on warm cream. Readable, not sterile.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Muted text for descriptions and helper copy.
                            </p>
                            <a href="#" className="text-sm font-medium text-primary transition-brand hover:text-primary/80 hover:underline">
                                Link styled with primary red
                            </a>
                        </div>
                    </Section>
                </main>
            </div>
        </>
    );
}
