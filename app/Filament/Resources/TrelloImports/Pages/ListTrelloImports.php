<?php

namespace App\Filament\Resources\TrelloImports\Pages;

use App\Filament\Resources\TrelloImports\TrelloImportResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListTrelloImports extends ListRecords
{
    protected static string $resource = TrelloImportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
