<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Native\Mobile\Biometrics;
use Native\Mobile\Camera;
use Native\Mobile\PushNotifications;
use Native\Mobile\SecureStorage;

class MobileBootstrapController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user()?->only(['id', 'name', 'email', 'avatar', 'timezone']),
            'app' => [
                'name' => config('app.name'),
                'url' => config('app.url'),
                'nativephp' => [
                    'app_id' => config('nativephp.app_id'),
                    'start_url' => config('nativephp.start_url'),
                    'deeplink_scheme' => config('nativephp.deeplink_scheme'),
                    'deeplink_host' => config('nativephp.deeplink_host'),
                ],
            ],
            'realtime' => [
                'broadcaster' => 'reverb',
                'host' => env('VITE_REVERB_HOST'),
                'port' => env('VITE_REVERB_PORT'),
                'scheme' => env('VITE_REVERB_SCHEME'),
                'key' => env('VITE_REVERB_APP_KEY'),
            ],
            'features' => [
                'camera' => class_exists(Camera::class),
                'biometrics' => class_exists(Biometrics::class),
                'push_notifications' => class_exists(PushNotifications::class),
                'secure_storage' => class_exists(SecureStorage::class),
            ],
        ]);
    }
}
