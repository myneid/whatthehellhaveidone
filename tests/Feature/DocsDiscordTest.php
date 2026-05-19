<?php

test('discord notifications docs page is publicly accessible', function () {
    $this->get('/docs/discord')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('docs/discord'));
});

test('discord notifications docs page has a branded title', function () {
    $this->get('/docs/discord')
        ->assertOk()
        ->assertSee('Discord Notifications – Docs', false);
});
