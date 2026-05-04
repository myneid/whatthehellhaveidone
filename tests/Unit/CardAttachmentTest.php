<?php

use App\Models\CardAttachment;
use Tests\TestCase;

uses(TestCase::class);

it('appends url when serialized', function (): void {
    $attachment = new CardAttachment([
        'filename' => 'preview.png',
        'disk' => 'public',
        'path' => 'attachments/cards/1/preview.png',
    ]);

    $serialized = $attachment->toArray();

    expect($serialized)
        ->toHaveKey('url')
        ->and($serialized['url'])
        ->toBeString()
        ->toEndWith('/storage/attachments/cards/1/preview.png');
});
