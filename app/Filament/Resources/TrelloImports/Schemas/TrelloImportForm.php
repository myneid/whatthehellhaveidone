<?php

namespace App\Filament\Resources\TrelloImports\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class TrelloImportForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('board_id')
                    ->relationship('board', 'name'),
                TextInput::make('source_board_id'),
                TextInput::make('source_board_name'),
                TextInput::make('status')
                    ->required()
                    ->default('pending'),
                TextInput::make('filename'),
                Textarea::make('summary')
                    ->columnSpanFull(),
                Textarea::make('errors')
                    ->columnSpanFull(),
                Textarea::make('warnings')
                    ->columnSpanFull(),
                Textarea::make('error_message')
                    ->columnSpanFull(),
                DateTimePicker::make('started_at'),
                DateTimePicker::make('completed_at'),
            ]);
    }
}
