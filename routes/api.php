<?php

use App\Http\Controllers\Api\AuthTokenController;
use App\Http\Controllers\Api\BoardController;
use App\Http\Controllers\Api\CardAttachmentController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\ChecklistController;
use App\Http\Controllers\Api\LabelController;
use App\Http\Controllers\Api\MobileBootstrapController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\WorkLogApiController;
use App\Http\Controllers\BoardListController;
use App\Http\Controllers\CardCommentController;
use App\Http\Controllers\ChecklistItemController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')->name('api.')->group(function () {
    Route::post('auth/token', [AuthTokenController::class, 'store'])
        ->middleware('throttle:login')
        ->name('auth.token.store');

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::get('me', [AuthTokenController::class, 'show'])->name('auth.me');
        Route::delete('auth/token', [AuthTokenController::class, 'destroy'])->name('auth.token.destroy');
        Route::get('mobile/bootstrap', MobileBootstrapController::class)->name('mobile.bootstrap');

        Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
        Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
        Route::get('projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
        Route::match(['put', 'patch'], 'projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
        Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

        Route::post('boards', [BoardController::class, 'store'])->name('boards.store');
        Route::get('boards/{board}', [BoardController::class, 'show'])->name('boards.show');
        Route::match(['put', 'patch'], 'boards/{board}', [BoardController::class, 'update'])->name('boards.update');
        Route::delete('boards/{board}', [BoardController::class, 'destroy'])->name('boards.destroy');

        Route::post('boards/{board}/lists', [BoardListController::class, 'store'])->name('boards.lists.store');
        Route::match(['put', 'patch'], 'lists/{list}', [BoardListController::class, 'update'])->name('lists.update');
        Route::delete('lists/{list}', [BoardListController::class, 'destroy'])->name('lists.destroy');

        Route::post('cards', [CardController::class, 'store'])->name('cards.store');
        Route::get('cards/{card}', [CardController::class, 'show'])->name('cards.show');
        Route::match(['put', 'patch'], 'cards/{card}', [CardController::class, 'update'])->name('cards.update');
        Route::delete('cards/{card}', [CardController::class, 'destroy'])->name('cards.destroy');
        Route::post('cards/{card}/move', [CardController::class, 'move'])->name('cards.move');
        Route::post('cards/{card}/archive', [CardController::class, 'archive'])->name('cards.archive');
        Route::post('cards/{card}/restore', [CardController::class, 'restore'])->name('cards.restore');
        Route::post('cards/{card}/assign', [CardController::class, 'assign'])->name('cards.assign');
        Route::delete('cards/{card}/unassign/{user}', [CardController::class, 'unassign'])->name('cards.unassign');
        Route::post('cards/{card}/watch', [CardController::class, 'watch'])->name('cards.watch');
        Route::delete('cards/{card}/unwatch', [CardController::class, 'unwatch'])->name('cards.unwatch');

        Route::post('cards/{card}/comments', [CardCommentController::class, 'store'])->name('cards.comments.store');
        Route::match(['put', 'patch'], 'comments/{comment}', [CardCommentController::class, 'update'])->name('comments.update');
        Route::delete('comments/{comment}', [CardCommentController::class, 'destroy'])->name('comments.destroy');

        Route::post('cards/{card}/checklists', [ChecklistController::class, 'store'])->name('cards.checklists.store');
        Route::match(['put', 'patch'], 'checklists/{checklist}', [ChecklistController::class, 'update'])->name('checklists.update');
        Route::delete('checklists/{checklist}', [ChecklistController::class, 'destroy'])->name('checklists.destroy');
        Route::post('checklists/{checklist}/items', [ChecklistItemController::class, 'store'])->name('checklists.items.store');
        Route::match(['put', 'patch'], 'checklist-items/{checklistItem}', [ChecklistItemController::class, 'update'])->name('checklist-items.update');
        Route::patch('checklist-items/{checklistItem}/toggle', [ChecklistItemController::class, 'toggle'])->name('checklist-items.toggle');
        Route::delete('checklist-items/{checklistItem}', [ChecklistItemController::class, 'destroy'])->name('checklist-items.destroy');

        Route::post('boards/{board}/labels', [LabelController::class, 'store'])->name('boards.labels.store');
        Route::match(['put', 'patch'], 'labels/{label}', [LabelController::class, 'update'])->name('labels.update');
        Route::delete('labels/{label}', [LabelController::class, 'destroy'])->name('labels.destroy');
        Route::post('cards/{card}/labels', [LabelController::class, 'attach'])->name('cards.labels.attach');
        Route::delete('cards/{card}/labels/{label}', [LabelController::class, 'detach'])->name('cards.labels.detach');

        Route::post('work-log', [WorkLogApiController::class, 'store'])->name('work-log.store');
        Route::get('work-log', [WorkLogApiController::class, 'index'])->name('work-log.index');
        Route::get('work-log/export', [WorkLogApiController::class, 'export'])->name('work-log.export');
        Route::match(['put', 'patch'], 'work-log/{workLogEntry}', [WorkLogApiController::class, 'update'])->name('work-log.update');

        Route::post('cards/{card}/attachments', [CardAttachmentController::class, 'store'])->name('cards.attachments.store');
        Route::delete('attachments/{attachment}', [CardAttachmentController::class, 'destroy'])->name('attachments.destroy');
    });
});
