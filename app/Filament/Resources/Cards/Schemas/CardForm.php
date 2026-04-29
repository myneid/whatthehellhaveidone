<?php

namespace App\Filament\Resources\Cards\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class CardForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('board_id')
                    ->relationship('board', 'name')
                    ->required(),
                Select::make('list_id')
                    ->relationship('list', 'name')
                    ->required(),
                Select::make('creator_id')
                    ->relationship('creator', 'name')
                    ->required(),
                TextInput::make('title')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                TextInput::make('position')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('priority')
                    ->required()
                    ->default('medium'),
                DateTimePicker::make('due_at'),
                DateTimePicker::make('started_at'),
                DateTimePicker::make('completed_at'),
                DateTimePicker::make('archived_at'),
                TextInput::make('source_system'),
                TextInput::make('source_card_id'),
                TextInput::make('source_board_id'),
            ]);
    }
}
