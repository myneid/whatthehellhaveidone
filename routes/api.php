<?php

use App\Http\Controllers\Api\WorkLogApiController;
use Illuminate\Support\Facades\Route;

Route::prefix('api/v1')->middleware(['auth:sanctum'])->group(function () {
    Route::post('work-log', [WorkLogApiController::class, 'store'])->name('api.work-log.store');
    Route::get('work-log', [WorkLogApiController::class, 'index'])->name('api.work-log.index');
    Route::get('work-log/export', [WorkLogApiController::class, 'export'])->name('api.work-log.export');
});
