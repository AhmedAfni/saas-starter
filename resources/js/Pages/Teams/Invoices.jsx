import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Receipt,
    Download,
    ArrowLeft,
    CreditCard,
    FileText,
    ExternalLink,
} from 'lucide-react';

export default function Invoices({ team, invoices = [] }) {
    const getStatusBadge = (status) => {
        const lower = (status || '').toLowerCase();
        if (lower === 'paid') {
            return (
                <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-500/30">
                    Paid
                </span>
            );
        }
        if (lower === 'open') {
            return (
                <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-500/30">
                    Open
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-600/10 dark:ring-slate-700 capitalize">
                {status || 'Unknown'}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Invoices
                            </h2>
                            <span className="text-slate-400 dark:text-slate-600 font-normal">&bull;</span>
                            <span className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">{team.name}</span>
                        </div>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Billing history and tax invoice downloads for this workspace.
                        </p>
                    </div>

                    <div>
                        <Link
                            href={route('teams.billing.index', team.id)}
                            className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300"
                        >
                            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
                            <span>Back to Billing</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Invoices - ${team.name}`} />

            <div className="space-y-6">
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                Billing History
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Official receipts and charge summaries generated through Stripe.
                            </p>
                        </div>
                        {invoices.length > 0 && (
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                {invoices.length} total invoice{invoices.length === 1 ? '' : 's'}
                            </span>
                        )}
                    </div>

                    {invoices.length === 0 ? (
                        <div className="p-8 sm:p-10 text-center" data-testid="empty-invoices-state">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-3 ring-6 ring-indigo-50/50 dark:ring-indigo-950/30">
                                <Receipt className="h-6 w-6" />
                            </div>
                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                No invoices yet
                            </h3>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                                Your team does not have any billing charges yet. When your plan renews, invoice records and downloadable receipts will appear here.
                            </p>
                            <div className="mt-5">
                                <Link
                                    href={route('teams.billing.index', team.id)}
                                    className="inline-flex items-center rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                                    <span>Manage Subscription</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-sm">
                                <thead className="bg-slate-50/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                                    <tr>
                                        <th scope="col" className="px-5 py-3">
                                            Date
                                        </th>
                                        <th scope="col" className="px-5 py-3">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-5 py-3">
                                            Status
                                        </th>
                                        <th scope="col" className="px-5 py-3 text-right">
                                            Receipt
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                                            <td className="px-5 py-3.5 whitespace-nowrap text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100">
                                                {invoice.date}
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                                                {invoice.amount}
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap text-xs sm:text-sm">
                                                {getStatusBadge(invoice.status)}
                                            </td>
                                            <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs sm:text-sm">
                                                {invoice.pdf_url || invoice.download_url ? (
                                                    <a
                                                        href={invoice.download_url || invoice.pdf_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition"
                                                    >
                                                        <Download className="mr-1.5 h-3.5 w-3.5" />
                                                        <span>Download PDF</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400 dark:text-slate-500">Unavailable</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
