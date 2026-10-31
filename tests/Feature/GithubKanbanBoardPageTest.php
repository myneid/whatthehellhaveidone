<?php

test('github kanban board page is publicly accessible', function () {
    $this->get('/github-kanban-board')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('github-kanban-board'));
});

test('github kanban board page has search meta', function () {
    $this->get('/github-kanban-board')
        ->assertOk()
        ->assertSee('Kanban Board for GitHub Issues – What the HELL have I done', false)
        ->assertSee('<meta name="description" content="A kanban board with two-way GitHub issue sync', false)
        ->assertSee('<link rel="canonical" href="'.route('github-kanban-board').'"', false);
});

test('github kanban board page is listed in the sitemap', function () {
    $this->get('/sitemap.xml')
        ->assertOk()
        ->assertSee('<loc>'.route('github-kanban-board').'</loc>', false);
});

test('github kanban board page receives billing state for its pricing comparisons', function (bool $isBillingConfigured) {
    $stripeValue = $isBillingConfigured ? 'configured' : null;

    config()->set('services.stripe.key', $stripeValue);
    config()->set('services.stripe.secret', $stripeValue);
    config()->set('services.stripe.price_id', $stripeValue);

    $this->get('/github-kanban-board')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('github-kanban-board')
            ->where('billingEnabled', $isBillingConfigured));
})->with([
    'billing enabled' => [true],
    'billing disabled' => [false],
]);
