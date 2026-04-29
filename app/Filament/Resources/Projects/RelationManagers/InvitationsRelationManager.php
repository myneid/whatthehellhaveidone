<?php

namespace App\Filament\Resources\Projects\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class InvitationsRelationManager extends RelationManager
{
    protected static string $relationship = 'invitations';

    protected static ?string $title = 'Invitations';

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('email')
                    ->searchable(),
                TextColumn::make('role')
                    ->badge(),
                TextColumn::make('invitedBy.name')
                    ->label('Invited by'),
                TextColumn::make('accepted_at')
                    ->dateTime()
                    ->placeholder('Pending')
                    ->sortable(),
                TextColumn::make('expires_at')
                    ->dateTime()
                    ->sortable(),
            ])
            ->modifyQueryUsing(fn ($query) => $query->with('invitedBy')->latest())
            ->recordActions([])
            ->toolbarActions([]);
    }
}
