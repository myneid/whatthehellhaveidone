<?php

namespace App\Filament\Resources\WorkLogEntries\Pages;

use App\Filament\Resources\WorkLogEntries\WorkLogEntryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditWorkLogEntry extends EditRecord
{
    protected static string $resource = WorkLogEntryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
