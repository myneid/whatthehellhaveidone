<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\BoardExportController;
use App\Http\Controllers\BoardListController;
use App\Http\Controllers\BoardMemberController;
use App\Http\Controllers\CardAttachmentController;
use App\Http\Controllers\CardCommentController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\ChecklistController;
use App\Http\Controllers\ChecklistItemController;
use App\Http\Controllers\DiscordWebhookController;
use App\Http\Controllers\DocumentFolderController;
use App\Http\Controllers\GithubController;
use App\Http\Controllers\GithubWebhookController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\LabelController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectDocumentController;
use App\Http\Controllers\ProjectGithubDocsController;
use App\Http\Controllers\ProjectMemberController;
use App\Http\Controllers\TrelloImportController;
use App\Http\Controllers\WorkLogController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// Documentation (public)
Route::prefix('docs')->name('docs.')->group(function () {
    Route::inertia('/', 'docs/index')->name('index');
    Route::inertia('/getting-started', 'docs/getting-started')->name('getting-started');
    Route::inertia('/boards', 'docs/boards')->name('boards');
    Route::inertia('/github', 'docs/github')->name('github');
    Route::inertia('/discord', 'docs/discord')->name('discord');
    Route::inertia('/trello-import', 'docs/trello-import')->name('trello-import');
    Route::inertia('/work-log', 'docs/work-log')->name('work-log');
    Route::inertia('/mcp-setup', 'docs/mcp-setup')->name('mcp-setup');
    Route::inertia('/mcp-tools', 'docs/mcp-setup')->name('mcp-tools');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [ProjectController::class, 'index'])->name('dashboard');

    // Projects
    Route::resource('projects', ProjectController::class);
    Route::resource('projects.members', ProjectMemberController::class)->shallow();
    Route::post('projects/{project}/invitations/{invitation}/resend', [ProjectMemberController::class, 'resend'])
        ->name('projects.invitations.resend');

    // Standalone Boards
    Route::resource('boards', BoardController::class);
    Route::resource('boards.members', BoardMemberController::class)->shallow();
    Route::resource('boards.lists', BoardListController::class)->shallow();
    Route::resource('boards.labels', LabelController::class)->shallow();
    Route::post('boards/{board}/export', [BoardExportController::class, 'export'])->name('boards.export');
    Route::get('boards/{board}/export/download', [BoardExportController::class, 'download'])->name('boards.export.download');

    // Trello import
    Route::post('boards/{board}/import/trello', [TrelloImportController::class, 'store'])->name('boards.import.trello');
    Route::get('boards/{board}/import/{trelloImport}', [TrelloImportController::class, 'show'])->name('boards.import.show');

    // GitHub integration
    Route::get('github/connect', [GithubController::class, 'redirect'])->name('github.redirect');
    Route::get('github/callback', [GithubController::class, 'callback'])->name('github.callback');
    Route::delete('github/{githubAccount}', [GithubController::class, 'destroy'])->name('github.destroy');
    Route::post('github/{githubAccount}/sync-repos', [GithubController::class, 'syncRepos'])->name('github.sync-repos');
    Route::get('boards/{board}/github/repositories', [GithubController::class, 'repositories'])->name('github.repositories');
    Route::post('boards/{board}/github/connect', [GithubController::class, 'connectRepository'])->name('github.connect-repository');
    Route::delete('boards/{board}/github/{boardGithubRepository}', [GithubController::class, 'disconnectRepository'])->name('github.disconnect-repository');
    Route::post('cards/{card}/github/create-issue', [GithubController::class, 'createIssue'])->name('github.create-issue');
    Route::post('cards/{card}/github/link-issue', [GithubController::class, 'linkIssue'])->name('github.link-issue');
    Route::post('cards/{card}/github/sync', [GithubController::class, 'syncCard'])->name('github.sync-card');
    Route::post('cards/{card}/github/assign-copilot', [GithubController::class, 'assignToCopilot'])->name('github.assign-copilot');
    Route::post('boards/{board}/github/import-issues', [GithubController::class, 'importIssues'])->name('github.import-issues');

    // Discord
    Route::post('boards/{board}/discord', [DiscordWebhookController::class, 'store'])->name('discord.store');
    Route::put('boards/{board}/discord', [DiscordWebhookController::class, 'update'])->name('discord.update');
    Route::delete('boards/{board}/discord', [DiscordWebhookController::class, 'destroy'])->name('discord.destroy');
    Route::post('boards/{board}/discord/test', [DiscordWebhookController::class, 'test'])->name('discord.test');

    // Board reports
    Route::get('boards/{board}/report', [BoardController::class, 'report'])->name('boards.report');

    // Label attach/detach
    Route::post('cards/{card}/labels', [LabelController::class, 'attach'])->name('cards.labels.attach');
    Route::delete('cards/{card}/labels/{label}', [LabelController::class, 'detach'])->name('cards.labels.detach');

    // Cards
    Route::resource('cards', CardController::class)->except(['index', 'create', 'edit']);
    Route::post('cards/{card}/move', [CardController::class, 'move'])->name('cards.move');
    Route::post('cards/{card}/archive', [CardController::class, 'archive'])->name('cards.archive');
    Route::post('cards/{card}/restore', [CardController::class, 'restore'])->name('cards.restore');
    Route::post('cards/{card}/assign', [CardController::class, 'assign'])->name('cards.assign');
    Route::delete('cards/{card}/unassign/{user}', [CardController::class, 'unassign'])->name('cards.unassign');
    Route::post('cards/{card}/watch', [CardController::class, 'watch'])->name('cards.watch');
    Route::delete('cards/{card}/unwatch', [CardController::class, 'unwatch'])->name('cards.unwatch');
    Route::resource('cards.comments', CardCommentController::class)->shallow()->except(['index', 'create', 'edit', 'show']);
    Route::resource('cards.attachments', CardAttachmentController::class)->shallow()->except(['index', 'create', 'edit', 'show', 'update']);
    Route::resource('cards.checklists', ChecklistController::class)->shallow()->except(['index', 'create', 'edit', 'show']);
    Route::resource('checklists.items', ChecklistItemController::class)->shallow()->except(['index', 'create', 'edit', 'show']);
    Route::patch('checklist-items/{checklistItem}/toggle', [ChecklistItemController::class, 'toggle'])->name('checklist-items.toggle');

    // Work Log
    Route::resource('work-log', WorkLogController::class)->except(['create', 'edit']);
    Route::get('work-log/export', [WorkLogController::class, 'export'])->name('work-log.export');

    // Documents
    Route::resource('projects.folders', DocumentFolderController::class)->shallow()->except(['create', 'edit', 'show']);
    Route::resource('projects.documents', ProjectDocumentController::class)->shallow()->except(['create', 'edit']);
    Route::get('documents/{document}/edit', [ProjectDocumentController::class, 'edit'])->name('documents.edit');

    // GitHub Docs (read-only markdown from linked repos)
    Route::get('projects/{project}/github-docs/{repository}', [ProjectGithubDocsController::class, 'show'])
        ->name('projects.github-docs.show');

});

// Invitations (token-based, public show; accept requires auth)
Route::get('invitations/{token}/accept', [InvitationController::class, 'show'])->name('invitations.show');
Route::post('invitations/{token}/accept', [InvitationController::class, 'accept'])->name('invitations.accept');

// GitHub webhook (public, signature verified)
Route::post('webhooks/github', [GithubWebhookController::class, 'handle'])->name('webhooks.github');

require __DIR__.'/settings.php';
require __DIR__.'/api.php';
