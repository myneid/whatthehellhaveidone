<?php

namespace App\Filament\Resources\GithubAccounts\Pages;

use App\Filament\Resources\GithubAccounts\GithubAccountResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditGithubAccount extends EditRecord
{
    protected static string $resource = GithubAccountResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
