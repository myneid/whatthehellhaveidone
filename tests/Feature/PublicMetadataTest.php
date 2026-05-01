<?php

foreach ([
    'home' => ['/', 'What the HELL have i DONE — Project Management'],
    'docs index' => ['/docs', 'Documentation – What the HELL have I done'],
    'docs getting started' => ['/docs/getting-started', 'Getting Started – Documentation – What the HELL have I done'],
    'mcp setup' => ['/docs/mcp-setup', 'MCP Setup – What the HELL have I done'],
] as $page => [$path, $title]) {
    test($page.' includes social preview metadata in the initial response', function () use ($path, $title) {
        $url = url($path);

        $response = $this->get($path);

        $response
            ->assertOk()
            ->assertSee('<link rel="canonical" href="'.$url.'">', false)
            ->assertSee('<meta property="og:type" content="website">', false)
            ->assertSee('<meta property="og:url" content="'.$url.'">', false)
            ->assertSee('<meta property="og:title" content="'.$title.'">', false)
            ->assertSee('<meta property="og:image" content="'.url('/og-image.png').'">', false)
            ->assertSee('<meta name="twitter:card" content="summary_large_image">', false)
            ->assertSee('<meta name="twitter:url" content="'.$url.'">', false)
            ->assertSee('<meta name="twitter:title" content="'.$title.'">', false)
            ->assertSee('<meta name="twitter:image" content="'.url('/og-image.png').'">', false);
    });
}
