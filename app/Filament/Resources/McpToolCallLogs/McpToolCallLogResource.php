<?php

namespace App\Filament\Resources\McpToolCallLogs;

use App\Filament\Resources\McpToolCallLogs\Pages\CreateMcpToolCallLog;
use App\Filament\Resources\McpToolCallLogs\Pages\EditMcpToolCallLog;
use App\Filament\Resources\McpToolCallLogs\Pages\ListMcpToolCallLogs;
use App\Filament\Resources\McpToolCallLogs\Schemas\McpToolCallLogForm;
use App\Filament\Resources\McpToolCallLogs\Tables\McpToolCallLogsTable;
use App\Models\McpToolCallLog;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class McpToolCallLogResource extends Resource
{
    protected static ?string $model = McpToolCallLog::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return McpToolCallLogForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return McpToolCallLogsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListMcpToolCallLogs::route('/'),
            'create' => CreateMcpToolCallLog::route('/create'),
            'edit' => EditMcpToolCallLog::route('/{record}/edit'),
        ];
    }
}
