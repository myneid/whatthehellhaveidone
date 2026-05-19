<?php

test('trello import docs page is publicly accessible', function () {
    $this->get('/docs/trello-import')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('docs/trello-import'));
});

test('trello import docs page has a branded title', function () {
    $this->get('/docs/trello-import')
        ->assertOk()
        ->assertSee('Trello Import – Docs', false);
});
