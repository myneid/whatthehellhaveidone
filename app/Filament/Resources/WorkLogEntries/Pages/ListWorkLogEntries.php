<?php

namespace App\Filament\Resources\WorkLogEntries\Pages;

use App\Filament\Resources\WorkLogEntries\WorkLogEntryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListWorkLogEntries extends ListRecords
{
    protected static string $resource = WorkLogEntryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
