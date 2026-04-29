<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class ActivityLogService
{
    public function log(
        Model $subject,
        string $eventType,
        array $old = [],
        array $new = [],
        ?User $actor = null,
        array $metadata = [],
    ): ActivityLog {
        return ActivityLog::create([
            'actor_id' => $actor?->id ?? auth()->id(),
            'subject_type' => $subject->getMorphClass(),
            'subject_id' => $subject->getKey(),
            'event_type' => $eventType,
            'old_values' => $old ?: null,
            'new_values' => $new ?: null,
            'metadata' => $metadata ?: null,
        ]);
    }
}
