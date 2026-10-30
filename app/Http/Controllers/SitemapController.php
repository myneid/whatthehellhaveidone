<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Routing\Route as RoutingRoute;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

class SitemapController extends Controller
{
    /**
     * Named public routes that always belong in the sitemap.
     *
     * @var list<string>
     */
    private const PUBLIC_ROUTE_NAMES = ['home', 'pricing', 'terms', 'privacy'];

    /**
     * Render an XML sitemap of the public marketing and documentation pages.
     *
     * Every named `docs.*` route is included automatically, so new docs pages
     * show up in the sitemap without touching this controller.
     */
    public function __invoke(): Response
    {
        $urls = collect(Route::getRoutes()->getRoutes())
            ->filter(fn (RoutingRoute $route): bool => $this->isPublicPage($route))
            ->map(fn (RoutingRoute $route): string => route($route->getName()))
            ->unique()
            ->sort()
            ->values();

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=utf-8');
    }

    private function isPublicPage(RoutingRoute $route): bool
    {
        $name = $route->getName();

        if ($name === null || ! in_array('GET', $route->methods(), true)) {
            return false;
        }

        if ($route->parameterNames() !== []) {
            return false;
        }

        return in_array($name, self::PUBLIC_ROUTE_NAMES, true) || Str::startsWith($name, 'docs.');
    }
}
