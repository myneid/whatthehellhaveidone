<?php

test('mcp setup docs page is publicly accessible', function () {
    $this->get('/docs/mcp-setup')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('docs/mcp-setup'));
});

test('mcp setup docs page has a branded title', function () {
    $this->get('/docs/mcp-setup')
        ->assertOk()
        ->assertSee('MCP Setup – Docs', false);
});

test('mcp tools docs page is publicly accessible', function () {
    $this->get('/docs/mcp-tools')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('docs/mcp-tools'));
});

test('mcp tools docs page has a branded title', function () {
    $this->get('/docs/mcp-tools')
        ->assertOk()
        ->assertSee('MCP Tools – Docs', false);
});
