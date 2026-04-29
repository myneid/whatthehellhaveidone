<?php

namespace App\Events;

use App\Models\Card;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CardCompleted
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public readonly Card $card) {}
}
