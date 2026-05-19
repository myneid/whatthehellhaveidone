<?php

test('projects and boards docs page is publicly accessible', function () {
    $this->get('/docs/boards')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('docs/boards'));
});

test('projects and boards docs page has a branded title', function () {
    $this->get('/docs/boards')
        ->assertOk()
        ->assertSee('Projects & Boards – Docs', false);
});
