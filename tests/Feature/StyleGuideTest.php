<?php

test('style guide page is publicly accessible', function () {
    $this->get('/style')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('style'));
});

test('style guide page has a branded title', function () {
    $this->get('/style')
        ->assertOk()
        ->assertSee('Style Guide – What the HELL have I done', false);
});
