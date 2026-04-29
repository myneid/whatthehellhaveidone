<?php

namespace App\Filament\Resources\GithubAccounts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class GithubAccountForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                TextInput::make('github_user_id')
                    ->required(),
                TextInput::make('username')
                    ->required(),
                TextInput::make('avatar_url')
                    ->url(),
                Textarea::make('scopes')
                    ->columnSpanFull(),
                DateTimePicker::make('connected_at')
                    ->required(),
                DateTimePicker::make('revoked_at'),
            ]);
    }
}
