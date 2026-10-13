<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Cashier\Cashier;

class StripeSetupCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stripe:setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create Stripe Pro Plan product and recurring price';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $stripe = Cashier::stripe();

        $this->info('Creating Stripe product "Pro Plan"...');

        $product = $stripe->products->create([
            'name' => 'Pro Plan',
        ]);

        $this->info('Creating recurring monthly price ($10 USD)...');

        $price = $stripe->prices->create([
            'product' => $product->id,
            'unit_amount' => 1000,
            'currency' => 'usd',
            'recurring' => ['interval' => 'month'],
        ]);

        $this->info("Stripe Price ID: {$price->id}");

        return self::SUCCESS;
    }
}
