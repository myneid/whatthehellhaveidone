<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class GroupsRelationManager extends RelationManager
{
    protected static string $relationship = 'groups';

    protected static ?string $title = 'Groups';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('users_count')
                    ->counts('users')
                    ->label('Members'),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->recordActions([])
            ->toolbarActions([]);
    }
}
