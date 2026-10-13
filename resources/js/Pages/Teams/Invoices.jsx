import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Invoices({ team, invoices = [] }) {
    const getStatusBadge = (status) => {
        const lower = (status || '').toLowerCase();
        if (lower === 'paid') {
            return (
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                    Paid
                </span>
            );
        }
        if (lower === 'open') {
            return (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    Open
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800 capitalize">
                {status || 'Unknown'}
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Invoices &bull; {team.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            View billing history and download past invoice receipts.
                        </p>
                    </div>
                    <div>
                        <Link
                            href={route('teams.billing.index', team.id)}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm transition hover:bg-gray-50"
                        >
                            &larr; Back to Billing
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Invoices - ${team.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Billing History</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                All Stripe subscription charges for {team.name}.
                            </p>
                        </div>

                        {invoices.length === 0 ? (
                            <div className="p-12 text-center" data-testid="empty-invoices-state">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="1.5"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h3 className="mt-4 text-sm font-semibold text-gray-900">No invoices yet</h3>
                                <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                                    Your team does not have any billing invoices on file. When your subscription is billed or renewed, invoices will appear here.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href={route('teams.billing.index', team.id)}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Manage Subscription
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Date
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Amount
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                Receipt
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {invoices.map((invoice) => (
                                            <tr key={invoice.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {invoice.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                                    {invoice.amount}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {getStatusBadge(invoice.status)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {invoice.pdf_url || invoice.download_url ? (
                                                        <a
                                                            href={invoice.download_url || invoice.pdf_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 font-medium"
                                                        >
                                                            <svg
                                                                className="mr-1.5 h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth="2"
                                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                                />
                                                            </svg>
                                                            Download PDF
                                                        </a>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Unavailable</span>
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
            </div>
        </AuthenticatedLayout>
    );
}
