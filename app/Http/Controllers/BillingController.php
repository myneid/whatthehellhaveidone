<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Checkout;

class BillingController extends Controller
{
    public function pricing(Request $request): Response
    {
        abort_unless(User::billingEnabled(), 404);

        $user = $request->user();

        return Inertia::render('pricing', [
            'isAuthenticated' => (bool) $user,
            'hasPaidAccess' => (bool) ($user?->hasPaidAccess() ?? false),
            'freeTier' => [
                'projects' => 1,
                'boards' => 2,
                'pricePerUser' => 4,
            ],
        ]);
    }

    public function checkout(Request $request): RedirectResponse
    {
        abort_unless(User::billingEnabled(), 404);

        $user = $request->user();

        abort_unless($user, 401);

        if ($user->hasPaidAccess()) {
            return redirect()->route('dashboard')->with('success', 'You already have full access.');
        }

        $priceId = config('services.stripe.price_id');

        if (blank($priceId)) {
            return redirect()->route('billing.pricing')->with('error', 'Stripe is not configured yet.');
        }

        $checkout = Checkout::customer($user)->create([
            $priceId => 1,
        ], [
            'mode' => 'subscription',
            'success_url' => route('billing.success').'/?checkout=success',
            'cancel_url' => route('billing.pricing'),
            'customer_email' => $user->email,
            'allow_promotion_codes' => true,
        ]);

        return $checkout->redirect();
    }

    public function success(Request $request): RedirectResponse
    {
        abort_unless(User::billingEnabled(), 404);

        $user = $request->user();

        if ($user) {
            return redirect()->route('dashboard')->with('success', 'Your subscription is active — you now have full access.');
        }

        return redirect()->route('home')->with('success', 'Your subscription is active.');
    }
}
