<?php

namespace App\Filament\Resources\TrelloImports;

use App\Filament\Resources\TrelloImports\Pages\CreateTrelloImport;
use App\Filament\Resources\TrelloImports\Pages\EditTrelloImport;
use App\Filament\Resources\TrelloImports\Pages\ListTrelloImports;
use App\Filament\Resources\TrelloImports\Schemas\TrelloImportForm;
use App\Filament\Resources\TrelloImports\Tables\TrelloImportsTable;
use App\Models\TrelloImport;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class TrelloImportResource extends Resource
{
    protected static ?string $model = TrelloImport::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return TrelloImportForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return TrelloImportsTable::configure($table);
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
            'index' => ListTrelloImports::route('/'),
            'create' => CreateTrelloImport::route('/create'),
            'edit' => EditTrelloImport::route('/{record}/edit'),
        ];
    }
}
