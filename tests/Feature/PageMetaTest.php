<?php

use Inertia\Ssr\Gateway;
use Inertia\Ssr\Response as SsrResponse;

/**
 * Bind an SSR gateway that always returns a rendered page, as the production SSR server does.
 */
function fakeSsrGateway(): void
{
    app()->instance(Gateway::class, new class implements Gateway
    {
        public function dispatch(array $page): ?SsrResponse
        {
            return new SsrResponse(
                '<title data-inertia="">SSR title</title>',
                '<div data-server-rendered="true" id="app">Server rendered body</div>',
            );
        }
    });
}

test('search and social meta are present when ssr renders the page', function () {
    fakeSsrGateway();

    $this->get('/trello-alternative')
        ->assertOk()
        ->assertSee('Server rendered body', false)
        ->assertSee('<meta name="description" content="A Trello alternative with GitHub issue sync', false)
        ->assertSee('<link rel="canonical" href="'.route('trello-alternative').'">', false)
        ->assertSee('<meta property="og:title" content="Trello Alternative for Developers', false);
});

test('ssr output supplies the only title tag', function () {
    fakeSsrGateway();

    $content = $this->get('/')->assertOk()->getContent();

    expect(substr_count($content, '<title'))->toBe(1)
        ->and($content)->toContain('<title data-inertia="">SSR title</title>');
});

test('blade title is the fallback when ssr is unavailable', function () {
    app()->instance(Gateway::class, new class implements Gateway
    {
        public function dispatch(array $page): ?SsrResponse
        {
            return null;
        }
    });

    $this->get('/docs/mcp-setup')
        ->assertOk()
        ->assertSee('<title>MCP Setup – What the HELL have I done</title>', false)
        ->assertSee('<meta name="description" content="Connect Claude, ChatGPT, or any MCP-compatible AI assistant', false);
});
