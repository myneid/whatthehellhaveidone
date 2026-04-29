<?php

namespace App\Filament\Resources\McpTokens\Pages;

use App\Filament\Resources\McpTokens\McpTokenResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditMcpToken extends EditRecord
{
    protected static string $resource = McpTokenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
