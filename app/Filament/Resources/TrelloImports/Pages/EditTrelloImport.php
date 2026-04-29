<?php

namespace App\Filament\Resources\TrelloImports\Pages;

use App\Filament\Resources\TrelloImports\TrelloImportResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditTrelloImport extends EditRecord
{
    protected static string $resource = TrelloImportResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
