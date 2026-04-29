<?php

namespace App\Filament\Resources\WorkLogEntries;

use App\Filament\Resources\WorkLogEntries\Pages\CreateWorkLogEntry;
use App\Filament\Resources\WorkLogEntries\Pages\EditWorkLogEntry;
use App\Filament\Resources\WorkLogEntries\Pages\ListWorkLogEntries;
use App\Filament\Resources\WorkLogEntries\Schemas\WorkLogEntryForm;
use App\Filament\Resources\WorkLogEntries\Tables\WorkLogEntriesTable;
use App\Models\WorkLogEntry;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class WorkLogEntryResource extends Resource
{
    protected static ?string $model = WorkLogEntry::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return WorkLogEntryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WorkLogEntriesTable::configure($table);
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
            'index' => ListWorkLogEntries::route('/'),
            'create' => CreateWorkLogEntry::route('/create'),
            'edit' => EditWorkLogEntry::route('/{record}/edit'),
        ];
    }
}
