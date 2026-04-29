<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class IntegrationsController extends Controller
{
    public function edit(Request $request): Response
    {
        $githubAccounts = $request->user()
            ->githubAccounts()
            ->with('repositories')
            ->get();

        return Inertia::render('settings/integrations', [
            'githubAccounts' => $githubAccounts,
        ]);
    }
}
