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
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                    Paid
                </span>
            );
        }
        if (lower === 'open') {
            return (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    Open
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/10 capitalize">
                {status || 'Unknown'}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Invoices
                            </h2>
                            <span className="text-slate-400 font-normal">&bull;</span>
                            <span className="text-lg font-medium text-slate-600">{team.name}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Billing history and tax invoice downloads for this workspace.
                        </p>
                    </div>

                    <div>
                        <Link
                            href={route('teams.billing.index', team.id)}
                            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
                        >
                            <ArrowLeft className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                            <span>Back to Billing</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Invoices - ${team.name}`} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 p-6 flex items-center justify-between">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900">
                                Billing History
                            </h3>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Official receipts and charge summaries generated through Stripe.
                            </p>
                        </div>
                        {invoices.length > 0 && (
                            <span className="text-xs font-medium text-slate-400">
                                {invoices.length} total invoice{invoices.length === 1 ? '' : 's'}
                            </span>
                        )}
                    </div>

                    {invoices.length === 0 ? (
                        <div className="p-12 text-center" data-testid="empty-invoices-state">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 mb-4 ring-8 ring-indigo-50/50">
                                <Receipt className="h-7 w-7" />
                            </div>
                            <h3 className="text-base font-semibold text-slate-900">
                                No invoices yet
                            </h3>
                            <p className="mt-1.5 text-sm text-slate-500 max-w-sm mx-auto">
                                Your team does not have any billing charges yet. When your plan renews, invoice records and downloadable receipts will appear here.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('teams.billing.index', team.id)}
                                    className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Manage Subscription</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                                <thead className="bg-slate-50/70 text-slate-500 uppercase text-[11px] font-semibold tracking-wider">
                                    <tr>
                                        <th scope="col" className="px-6 py-3.5">
                                            Date
                                        </th>
                                        <th scope="col" className="px-6 py-3.5">
                                            Amount
                                        </th>
                                        <th scope="col" className="px-6 py-3.5">
                                            Status
                                        </th>
                                        <th scope="col" className="px-6 py-3.5 text-right">
                                            Receipt
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-slate-50/60 transition">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {invoice.date}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                                                {invoice.amount}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {getStatusBadge(invoice.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                {invoice.pdf_url || invoice.download_url ? (
                                                    <a
                                                        href={invoice.download_url || invoice.pdf_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                                                    >
                                                        <Download className="mr-1.5 h-3.5 w-3.5" />
                                                        <span>Download PDF</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-slate-400">Unavailable</span>
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
