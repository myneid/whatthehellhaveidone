<?php

namespace App\Filament\Resources\GithubAccounts;

use App\Filament\Resources\GithubAccounts\Pages\CreateGithubAccount;
use App\Filament\Resources\GithubAccounts\Pages\EditGithubAccount;
use App\Filament\Resources\GithubAccounts\Pages\ListGithubAccounts;
use App\Filament\Resources\GithubAccounts\Schemas\GithubAccountForm;
use App\Filament\Resources\GithubAccounts\Tables\GithubAccountsTable;
use App\Models\GithubAccount;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class GithubAccountResource extends Resource
{
    protected static ?string $model = GithubAccount::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return GithubAccountForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return GithubAccountsTable::configure($table);
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
            'index' => ListGithubAccounts::route('/'),
            'create' => CreateGithubAccount::route('/create'),
            'edit' => EditGithubAccount::route('/{record}/edit'),
        ];
    }
}
