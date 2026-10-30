<?php

use Illuminate\Support\Facades\Route;

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
        ->toContain(route('trello-alternative'))
        ->toContain(route('docs.index'))
        ->toContain(route('docs.mcp-setup'))
        ->toContain(route('docs.mcp-tools'))
        ->toContain(route('terms'))
        ->toContain(route('privacy'));
});

it('lists the pricing page only when billing is enabled', function () {
    $content = $this->get('/sitemap.xml')->getContent();

    if (Route::has('pricing')) {
        expect($content)->toContain('<loc>'.route('pricing').'</loc>');
    } else {
        expect($content)->not->toContain('/pricing</loc>');
    }
});

it('excludes authenticated and parameterized routes from the sitemap', function () {
    $content = $this->get('/sitemap.xml')->getContent();

    expect($content)
        ->not->toContain('/dashboard')
        ->not->toContain('/billing')
        ->not->toContain('github-docs')
        ->not->toContain('{');
});
