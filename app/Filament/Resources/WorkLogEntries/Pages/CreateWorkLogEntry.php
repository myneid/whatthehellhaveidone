<?php

namespace App\Filament\Resources\WorkLogEntries\Pages;

use App\Filament\Resources\WorkLogEntries\WorkLogEntryResource;
use Filament\Resources\Pages\CreateRecord;

class CreateWorkLogEntry extends CreateRecord
{
    protected static string $resource = WorkLogEntryResource::class;
}
