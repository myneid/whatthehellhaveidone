<?php

namespace App\Filament\Resources\GithubAccounts\Pages;

use App\Filament\Resources\GithubAccounts\GithubAccountResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListGithubAccounts extends ListRecords
{
    protected static string $resource = GithubAccountResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
