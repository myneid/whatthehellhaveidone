<?php

test('github integration docs page is publicly accessible', function () {
    $this->get('/docs/github')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('docs/github'));
});

test('github integration docs page has a branded title', function () {
    $this->get('/docs/github')
        ->assertOk()
        ->assertSee('GitHub Integration – Docs', false);
});
