<?php

namespace App\Filament\Resources\McpTokens;

use App\Filament\Resources\McpTokens\Pages\CreateMcpToken;
use App\Filament\Resources\McpTokens\Pages\EditMcpToken;
use App\Filament\Resources\McpTokens\Pages\ListMcpTokens;
use App\Filament\Resources\McpTokens\Schemas\McpTokenForm;
use App\Filament\Resources\McpTokens\Tables\McpTokensTable;
use App\Models\McpToken;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class McpTokenResource extends Resource
{
    protected static ?string $model = McpToken::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return McpTokenForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return McpTokensTable::configure($table);
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
            'index' => ListMcpTokens::route('/'),
            'create' => CreateMcpToken::route('/create'),
            'edit' => EditMcpToken::route('/{record}/edit'),
        ];
    }
}
