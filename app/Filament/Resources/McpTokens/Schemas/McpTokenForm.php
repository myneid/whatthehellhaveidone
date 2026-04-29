<?php

namespace App\Filament\Resources\McpTokens\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class McpTokenForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('project_id')
                    ->relationship('project', 'name'),
                TextInput::make('name')
                    ->required(),
                TextInput::make('token_hash')
                    ->required(),
                Textarea::make('scopes')
                    ->columnSpanFull(),
                Textarea::make('allowed_tools')
                    ->columnSpanFull(),
                DateTimePicker::make('last_used_at'),
                DateTimePicker::make('revoked_at'),
            ]);
    }
}
