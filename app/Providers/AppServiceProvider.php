<?php

namespace App\Providers;

use App\Events\CardCommented;
use App\Events\CardCompleted;
use App\Events\CardCreated;
use App\Events\CardMoved;
use App\Listeners\ApplyListGithubActionOnCardMove;
use App\Listeners\SendDiscordNotificationForCardEvent;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerEventListeners();
    }

    protected function registerEventListeners(): void
    {
        foreach ([CardCreated::class, CardMoved::class, CardCompleted::class, CardCommented::class] as $event) {
            Event::listen($event, SendDiscordNotificationForCardEvent::class);
        }

        Event::listen(CardMoved::class, ApplyListGithubActionOnCardMove::class);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
