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
            $meta = [
                'welcome' => [
                    'title' => 'What the HELL have i DONE — Project Management',
                    'description' => "Project management with Kanban boards, GitHub sync, Discord notifications, a work log, AI-agent access via MCP, and documents in one place.",
                    'url' => url('/'),
                    'image' => url('/whatthehellhaveidone.png'),
                ],
                'docs/index' => [
                    'title' => 'Documentation – What the HELL have I done',
                    'description' => 'A full-featured project management platform with built-in AI integration via MCP. Manage projects, boards, and cards — and let your AI assistant do it for you.',
                    'url' => url('/docs'),
                    'image' => url('/whatthehellhaveidone.png'),
                ],
                'docs/mcp-setup' => [
                    'title' => 'MCP Setup – What the HELL have I done',
                    'description' => 'Connect Claude, ChatGPT, or any MCP-compatible AI assistant to your boards, cards, and work log via the built-in MCP server.',
                    'url' => url('/docs/mcp-setup'),
                    'image' => url('/whatthehellhaveidone.png'),
                ],
            ][$page['component']] ?? null;
        @endphp

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            @if ($meta)
                <title>{{ $meta['title'] }}</title>
                <meta name="description" content="{{ $meta['description'] }}">
                <meta property="og:type" content="website">
                <meta property="og:url" content="{{ $meta['url'] }}">
                <meta property="og:title" content="{{ $meta['title'] }}">
                <meta property="og:description" content="{{ $meta['description'] }}">
                <meta property="og:image" content="{{ $meta['image'] }}">
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:title" content="{{ $meta['title'] }}">
                <meta name="twitter:description" content="{{ $meta['description'] }}">
                <meta name="twitter:image" content="{{ $meta['image'] }}">
            @else
                <title>{{ config('app.name', 'Laravel') }}</title>
            @endif
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
