<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TeamInvoiceController extends Controller
{
    /**
     * Display the team's invoices.
     */
    public function index(Request $request, Team $team): Response
    {
        Gate::authorize('manageBilling', $team);

        $invoices = [];

        if ($team->hasStripeId()) {
            try {
                $invoices = $team->invoices()->map(function ($invoice) use ($team) {
                    return [
                        'id' => $invoice->id,
                        'date' => $invoice->date()->toFormattedDateString(),
                        'amount' => $invoice->total(),
                        'status' => $invoice->status,
                        'pdf_url' => $invoice->invoice_pdf ?? $invoice->hosted_invoice_url,
                        'download_url' => route('teams.invoices.download', [$team->id, $invoice->id]),
                    ];
                })->values()->all();
            } catch (\Throwable $e) {
                $invoices = [];
            }
        }

        return Inertia::render('Teams/Invoices', [
            'team' => [
                'id' => $team->id,
                'name' => $team->name,
            ],
            'invoices' => $invoices,
        ]);
    }

    /**
     * Redirect to the Stripe hosted PDF for the given invoice.
     */
    public function download(Request $request, Team $team, string $invoice): RedirectResponse
    {
        Gate::authorize('manageBilling', $team);

        $cashierInvoice = $team->findInvoiceOrFail($invoice);
        $pdfUrl = $cashierInvoice->invoice_pdf ?: $cashierInvoice->hosted_invoice_url;

        if (! $pdfUrl) {
            abort(404, 'Invoice PDF not available.');
        }

        return redirect()->away($pdfUrl);
    }
}
