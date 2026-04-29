<?php

namespace App\Filament\Resources\GithubAccounts\Pages;

use App\Filament\Resources\GithubAccounts\GithubAccountResource;
use Filament\Resources\Pages\CreateRecord;

class CreateGithubAccount extends CreateRecord
{
    protected static string $resource = GithubAccountResource::class;
}
