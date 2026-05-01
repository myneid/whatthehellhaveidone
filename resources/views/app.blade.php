<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @php
            $defaultMeta = [
                'title' => config('app.name', 'What the HELL have I done'),
                'description' => 'Project management with Kanban boards, GitHub sync, Discord notifications, work logs, AI-agent access via MCP, and documents in one place.',
                'url' => request()->url(),
                'image' => url('/og-image.png'),
            ];

            $pageMeta = [
                'welcome' => [
                    'title' => 'What the HELL have i DONE — Project Management',
                    'description' => "Project management with Kanban boards, GitHub sync, Discord notifications, a work log, AI-agent access via MCP, and documents in one place.",
                ],
                'docs/index' => [
                    'title' => 'Documentation – What the HELL have I done',
                    'description' => 'A full-featured project management platform with built-in AI integration via MCP. Manage projects, boards, and cards — and let your AI assistant do it for you.',
                ],
                'docs/getting-started' => [
                    'title' => 'Getting Started – Documentation – What the HELL have I done',
                    'description' => 'Learn how to set up projects, boards, and cards quickly with What the HELL have I done.',
                ],
                'docs/boards' => [
                    'title' => 'Boards – Documentation – What the HELL have I done',
                    'description' => 'Understand lists, cards, labels, and workflows for Kanban boards.',
                ],
                'docs/github' => [
                    'title' => 'GitHub Integration – Documentation – What the HELL have I done',
                    'description' => 'Connect GitHub repositories and sync issues with your project boards.',
                ],
                'docs/discord' => [
                    'title' => 'Discord Integration – Documentation – What the HELL have I done',
                    'description' => 'Configure Discord webhooks for board activity and project notifications.',
                ],
                'docs/trello-import' => [
                    'title' => 'Trello Import – Documentation – What the HELL have I done',
                    'description' => 'Import Trello boards and migrate your existing workflows into the app.',
                ],
                'docs/work-log' => [
                    'title' => 'Work Log – Documentation – What the HELL have I done',
                    'description' => 'Track work sessions, activities, and context across your projects.',
                ],
                'docs/mcp-setup' => [
                    'title' => 'MCP Setup – What the HELL have I done',
                    'description' => 'Connect Claude, ChatGPT, or any MCP-compatible AI assistant to your boards, cards, and work log via the built-in MCP server.',
                ],
            ];

            $meta = array_merge($defaultMeta, $pageMeta[$page['component']] ?? []);
        @endphp

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ $meta['title'] }}</title>
            <meta name="description" content="{{ $meta['description'] }}">
            <link rel="canonical" href="{{ $meta['url'] }}">

            <meta property="og:type" content="website">
            <meta property="og:site_name" content="{{ config('app.name', 'What the HELL have I done') }}">
            <meta property="og:url" content="{{ $meta['url'] }}">
            <meta property="og:title" content="{{ $meta['title'] }}">
            <meta property="og:description" content="{{ $meta['description'] }}">
            <meta property="og:image" content="{{ $meta['image'] }}">
            <meta property="og:image:alt" content="{{ $meta['title'] }}">

            <meta name="twitter:card" content="summary_large_image">
            <meta name="twitter:url" content="{{ $meta['url'] }}">
            <meta name="twitter:title" content="{{ $meta['title'] }}">
            <meta name="twitter:description" content="{{ $meta['description'] }}">
            <meta name="twitter:image" content="{{ $meta['image'] }}">
            <meta name="twitter:image:alt" content="{{ $meta['title'] }}">
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
