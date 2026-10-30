<?php

it('serves an xml sitemap of public pages', function () {
    $response = $this->get('/sitemap.xml');

    $response->assertOk();
    expect($response->headers->get('Content-Type'))->toContain('application/xml');

    $xml = simplexml_load_string($response->getContent());
    expect($xml)->not->toBeFalse();

    $locations = [];

    foreach ($xml->url as $url) {
        $locations[] = (string) $url->loc;
    }

    expect($locations)
        ->toContain(route('home'))
        ->toContain(route('pricing'))
        ->toContain(route('docs.index'))
        ->toContain(route('docs.mcp-setup'))
        ->toContain(route('docs.mcp-tools'))
        ->toContain(route('terms'))
        ->toContain(route('privacy'));
});

it('excludes authenticated and parameterized routes from the sitemap', function () {
    $content = $this->get('/sitemap.xml')->getContent();

    expect($content)
        ->not->toContain('/dashboard')
        ->not->toContain('/billing')
        ->not->toContain('github-docs')
        ->not->toContain('{');
});
