<?php

foreach ([
    'home' => ['/', 'What the HELL have i DONE — Project Management'],
    'docs index' => ['/docs', 'Documentation – What the HELL have I done'],
    'mcp setup' => ['/docs/mcp-setup', 'MCP Setup – What the HELL have I done'],
] as $page => [$path, $title]) {
    test($page.' includes social preview metadata in the initial response', function () use ($path, $title) {
        $response = $this->get($path);

        $response
            ->assertOk()
            ->assertSee('<meta property="og:type" content="website">', false)
            ->assertSee('<meta property="og:url" content="'.url($path === '/' ? '/' : $path).'">', false)
            ->assertSee('<meta property="og:title" content="'.$title.'">', false)
            ->assertSee('<meta property="og:image" content="'.url('/whatthehellhaveidone.png').'">', false)
            ->assertSee('<meta name="twitter:card" content="summary_large_image">', false)
            ->assertSee('<meta name="twitter:title" content="'.$title.'">', false)
            ->assertSee('<meta name="twitter:image" content="'.url('/whatthehellhaveidone.png').'">', false);
    });
}
