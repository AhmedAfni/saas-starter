import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Billing({ team, isSubscribed, subscription, memberCount, totalSeatsTaken, maxFreeSeats }) {
    const { flash } = usePage().props;

    const { post: postSubscribe, processing: subscribing } = useForm({});
    const { post: postPortal, processing: loadingPortal } = useForm({});

    const handleSubscribe = (e) => {
        e.preventDefault();
        postSubscribe(route('teams.billing.subscribe', team.id));
    };

    const handleOpenPortal = (e) => {
        e.preventDefault();
        postPortal(route('teams.billing.portal', team.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Billing &bull; {team.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage subscription plans and member limits for your team.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Billing - ${team.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash?.status && (
                        <div className="rounded-md bg-green-50 p-4 border border-green-200">
                            <p className="text-sm font-medium text-green-800">{flash.status}</p>
                        </div>
                    )}

                    {/* Current Plan Overview */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Subscription Status</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Billing is scoped to the team level. All team members share this subscription.
                                </p>
                            </div>
                            <div className="mt-3 sm:mt-0">
                                {isSubscribed ? (
                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">
                                        Pro Plan &bull; Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                                        Free Plan
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Plan usage & limits */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="rounded-lg border border-gray-200 p-5 bg-gray-50">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                                    Member Seats Usage
                                </h4>
                                <div className="mt-2 flex items-baseline space-x-2">
                                    <span className="text-3xl font-extrabold text-gray-900">{totalSeatsTaken}</span>
                                    <span className="text-sm text-gray-500">
                                        / {isSubscribed ? 'Unlimited' : `${maxFreeSeats} max`}
                                    </span>
                                </div>
                                <p className="mt-2 text-xs text-gray-500">
                                    {memberCount} active member{memberCount === 1 ? '' : 's'} + {totalSeatsTaken - memberCount} pending invite{totalSeatsTaken - memberCount === 1 ? '' : 's'}.
                                </p>
                                {!isSubscribed && (
                                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full ${
                                                totalSeatsTaken >= maxFreeSeats ? 'bg-amber-500' : 'bg-indigo-600'
                                            }`}
                                            style={{ width: `${Math.min(100, (totalSeatsTaken / maxFreeSeats) * 100)}%` }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="rounded-lg border border-gray-200 p-5 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                                        Plan Features
                                    </h4>
                                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                        <li className="flex items-center">
                                            <svg className="h-4 w-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {isSubscribed ? 'Unlimited team members' : 'Up to 3 team members'}
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-4 w-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Tenant isolated project workspaces
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="h-4 w-4 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Role-based permission controls
                                        </li>
                                    </ul>
                                </div>

                                <div className="mt-4 pt-3 border-t border-gray-100">
                                    {isSubscribed ? (
                                        <form onSubmit={handleOpenPortal}>
                                            <SecondaryButton type="submit" disabled={loadingPortal} className="w-full justify-center">
                                                {loadingPortal ? 'Opening Portal...' : 'Manage Subscription & Invoices'}
                                            </SecondaryButton>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleSubscribe}>
                                            <PrimaryButton type="submit" disabled={subscribing} className="w-full justify-center">
                                                {subscribing ? 'Redirecting to Stripe...' : 'Upgrade to Pro Plan'}
                                            </PrimaryButton>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
