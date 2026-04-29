<?php

namespace App\Filament\Resources\McpToolCallLogs\Pages;

use App\Filament\Resources\McpToolCallLogs\McpToolCallLogResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditMcpToolCallLog extends EditRecord
{
    protected static string $resource = McpToolCallLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
