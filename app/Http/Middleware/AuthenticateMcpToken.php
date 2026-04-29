<?php

namespace App\Http\Middleware;

use App\Models\McpToken;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateMcpToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $plainToken = $request->bearerToken();

        if (! is_string($plainToken) || $plainToken === '') {
            abort(401, 'Missing MCP bearer token.');
        }

        $token = McpToken::query()
            ->where('token_hash', hash('sha256', $plainToken))
            ->whereNull('revoked_at')
            ->with('user')
            ->first();

        if ($token === null || $token->user === null) {
            abort(401, 'Invalid MCP bearer token.');
        }

        $user = $token->user;

        Auth::setUser($user);
        $request->setUserResolver(static fn () => $user);
        $request->attributes->set('mcpToken', $token);

        $token->forceFill(['last_used_at' => now()])->save();

        return $next($request);
    }
}
