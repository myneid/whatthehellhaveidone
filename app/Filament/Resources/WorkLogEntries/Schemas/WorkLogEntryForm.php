<?php

namespace App\Filament\Resources\WorkLogEntries\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class WorkLogEntryForm
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
                Select::make('board_id')
                    ->relationship('board', 'name'),
                Select::make('card_id')
                    ->relationship('card', 'title'),
                TextInput::make('source')
                    ->required()
                    ->default('manual'),
                TextInput::make('entry_type')
                    ->required()
                    ->default('manual'),
                Textarea::make('body')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('hashtags')
                    ->columnSpanFull(),
                DateTimePicker::make('started_at'),
                DateTimePicker::make('ended_at'),
                TextInput::make('duration_seconds')
                    ->numeric(),
                TextInput::make('reference_url')
                    ->url(),
                Textarea::make('metadata')
                    ->columnSpanFull(),
            ]);
    }
}
