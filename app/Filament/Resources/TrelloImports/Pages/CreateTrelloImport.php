<?php

namespace App\Filament\Resources\TrelloImports\Pages;

use App\Filament\Resources\TrelloImports\TrelloImportResource;
use Filament\Resources\Pages\CreateRecord;

class CreateTrelloImport extends CreateRecord
{
    protected static string $resource = TrelloImportResource::class;
}
