<?php

namespace App\Filament\Resources\McpToolCallLogs\Pages;

use App\Filament\Resources\McpToolCallLogs\McpToolCallLogResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListMcpToolCallLogs extends ListRecords
{
    protected static string $resource = McpToolCallLogResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
