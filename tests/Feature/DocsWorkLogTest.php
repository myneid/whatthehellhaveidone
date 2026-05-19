<?php

test('work log docs page is publicly accessible', function () {
    $this->get('/docs/work-log')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('docs/work-log'));
});

test('work log docs page has a branded title', function () {
    $this->get('/docs/work-log')
        ->assertOk()
        ->assertSee('Work Log – Docs', false);
});
