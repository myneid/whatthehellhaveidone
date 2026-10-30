<?php

test('trello alternative page is publicly accessible', function () {
    $this->get('/trello-alternative')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('trello-alternative'));
});

test('trello alternative page has search meta', function () {
    $this->get('/trello-alternative')
        ->assertOk()
        ->assertSee('Trello Alternative for Developers – What the HELL have I done</title>', false)
        ->assertSee('A Trello alternative with GitHub issue sync', false)
        ->assertSee('<link rel="canonical" href="'.route('trello-alternative').'"', false);
});

test('trello alternative page is listed in the sitemap', function () {
    $this->get('/sitemap.xml')
        ->assertOk()
        ->assertSee('<loc>'.route('trello-alternative').'</loc>', false);
});

test('trello alternative page receives billing state for its pricing comparisons', function (bool $isBillingConfigured) {
    $stripeValue = $isBillingConfigured ? 'configured' : null;

    config()->set('services.stripe.key', $stripeValue);
    config()->set('services.stripe.secret', $stripeValue);
    config()->set('services.stripe.price_id', $stripeValue);

    $this->get('/trello-alternative')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('trello-alternative')
            ->where('billingEnabled', $isBillingConfigured));
})->with([
    'billing enabled' => [true],
    'billing disabled' => [false],
]);
