<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;

class AuthTokenController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['required', 'string', 'max:255'],
        ]);

        if (! Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        /** @var User $user */
        $user = $request->user();
        $token = $user->createToken($validated['device_name'], ['mobile'])->plainTextToken;

        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'token_type' => 'Bearer',
            'access_token' => $token,
            'user' => $user->only(['id', 'name', 'email', 'avatar', 'timezone']),
        ]);
    }

    public function show(Request $request): JsonResponse
    {
        $token = $this->resolveBearerToken($request);

        if ($token === null || $token->tokenable_id !== $request->user()?->getKey()) {
            abort(401);
        }

        return response()->json([
            'user' => $request->user()?->only(['id', 'name', 'email', 'avatar', 'timezone']),
        ]);
    }

    public function destroy(Request $request): JsonResponse
    {
        $token = $this->resolveBearerToken($request);

        if ($token === null || $token->tokenable_id !== $request->user()?->getKey()) {
            abort(401);
        }

        $request->user()?->tokens()->whereKey($token->getKey())->delete();

        return response()->json(status: 204);
    }

    private function resolveBearerToken(Request $request): ?PersonalAccessToken
    {
        $bearerToken = $request->bearerToken();

        if (! $bearerToken) {
            return null;
        }

        return PersonalAccessToken::findToken($bearerToken);
    }
}
