<?php

use App\Http\Controllers\McpTokenController;
use App\Http\Controllers\Settings\IntegrationsController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\SecurityController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');

    Route::get('settings/integrations', [IntegrationsController::class, 'edit'])->name('integrations.edit');

    Route::get('mcp-tokens', [McpTokenController::class, 'index'])->name('mcp-tokens.index');
    Route::post('mcp-tokens', [McpTokenController::class, 'store'])->name('mcp-tokens.store');
    Route::delete('mcp-tokens/{mcp_token}', [McpTokenController::class, 'destroy'])->name('mcp-tokens.destroy');
});
