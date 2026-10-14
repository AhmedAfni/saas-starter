import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    CreditCard,
    CheckCircle2,
    Zap,
    Users,
    Shield,
    FileText,
    ExternalLink,
    ArrowRight,
    Sparkles,
} from 'lucide-react';

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

    const percentUsed = isSubscribed
        ? 0
        : Math.min(100, Math.round((totalSeatsTaken / (maxFreeSeats || 1)) * 100));

    const isAtOrOverCapacity = !isSubscribed && totalSeatsTaken >= maxFreeSeats;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                Billing & Subscription
                            </h2>
                            <span className="text-slate-400 font-normal">&bull;</span>
                            <span className="text-lg font-medium text-slate-600">{team.name}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                            Manage workspace plans, seat capacity, and automated invoicing.
                        </p>
                    </div>

                    <div>
                        <Link
                            href={route('teams.invoices.index', team.id)}
                            className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
                        >
                            <FileText className="mr-2 h-4 w-4 text-slate-500" />
                            <span>Billing Invoices &rarr;</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Billing - ${team.name}`} />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Flash Message */}
                {flash?.status && (
                    <div className="rounded-xl bg-emerald-50 p-4 border border-emerald-200/80 flex items-center space-x-3 text-emerald-800">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                        <p className="text-sm font-medium">{flash.status}</p>
                    </div>
                )}

                {/* Plan Card Overview */}
                <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
                    {/* Plan Header */}
                    <div className="border-b border-slate-100 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-50/60 to-white">
                        <div className="flex items-center space-x-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                                <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h3 className="text-xl font-bold text-slate-900">
                                        {isSubscribed ? 'Pro Plan' : 'Free Plan'}
                                    </h3>
                                    {isSubscribed ? (
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                            Active Subscription
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/10">
                                            Free Plan
                                        </span>
                                    )}
                                </div>
                                <p className="mt-1 text-xs sm:text-sm text-slate-500">
                                    Subscription charges are billed directly at the team level and shared across all team members.
                                </p>
                            </div>
                        </div>

                        <div>
                            {isSubscribed ? (
                                <form onSubmit={handleOpenPortal}>
                                    <SecondaryButton
                                        type="submit"
                                        disabled={loadingPortal}
                                        className="rounded-xl px-4 py-2.5"
                                    >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        {loadingPortal ? 'Opening Portal...' : 'Manage via Stripe Portal'}
                                    </SecondaryButton>
                                </form>
                            ) : (
                                <form onSubmit={handleSubscribe}>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={subscribing}
                                        className="rounded-xl px-5 py-2.5 text-sm"
                                    >
                                        <Zap className="mr-2 h-4 w-4" />
                                        {subscribing ? 'Connecting...' : 'Upgrade to Pro'}
                                    </PrimaryButton>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Plan Details & Seats Usage */}
                    <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Member Seats Card */}
                        <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Member Seats Capacity
                                    </span>
                                    <Users className="h-4 w-4 text-slate-400" />
                                </div>

                                <div className="mt-4 flex items-baseline space-x-2">
                                    <span className="text-4xl font-extrabold tracking-tight text-slate-900">
                                        {totalSeatsTaken}
                                    </span>
                                    <span className="text-base font-medium text-slate-500">
                                        / {isSubscribed ? 'Unlimited' : `${maxFreeSeats} max free seats`}
                                    </span>
                                </div>

                                <p className="mt-2 text-xs text-slate-500">
                                    <span className="font-semibold text-slate-700">{memberCount}</span> active member{memberCount === 1 ? '' : 's'} +{' '}
                                    <span className="font-semibold text-slate-700">{Math.max(0, totalSeatsTaken - memberCount)}</span> pending invitation{totalSeatsTaken - memberCount === 1 ? '' : 's'}.
                                </p>

                                {/* Progress Bar */}
                                {!isSubscribed ? (
                                    <div className="mt-5 space-y-2">
                                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                                            <span>Used capacity</span>
                                            <span>{percentUsed}%</span>
                                        </div>
                                        <div className="h-2.5 w-full rounded-full bg-slate-200 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isAtOrOverCapacity ? 'bg-amber-500' : 'bg-indigo-600'
                                                }`}
                                                style={{ width: `${percentUsed}%` }}
                                            />
                                        </div>
                                        {isAtOrOverCapacity && (
                                            <p className="text-xs font-medium text-amber-600 pt-1">
                                                Seat limit reached. Upgrade to Pro for unlimited team collaboration.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-5 rounded-lg bg-emerald-50 p-3 border border-emerald-100 flex items-center space-x-2 text-emerald-800 text-xs">
                                        <Sparkles className="h-4 w-4 text-emerald-600 shrink-0" />
                                        <span>Unlimited seat capacity is unlocked with your active Pro Plan.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Plan Features Included */}
                        <div className="rounded-xl border border-slate-200/80 bg-white p-6 flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                    Included Features
                                </span>

                                <ul className="mt-4 space-y-3">
                                    <li className="flex items-center text-sm text-slate-700">
                                        <div className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span>{isSubscribed ? 'Unlimited team members' : 'Up to 3 team members free'}</span>
                                    </li>
                                    <li className="flex items-center text-sm text-slate-700">
                                        <div className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span>Multi-tenant workspace isolation</span>
                                    </li>
                                    <li className="flex items-center text-sm text-slate-700">
                                        <div className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span>Role-based permission controls (Owner, Admin, Member)</span>
                                    </li>
                                    <li className="flex items-center text-sm text-slate-700">
                                        <div className="mr-3 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                        </div>
                                        <span>Automated billing & PDF invoice downloads</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <Link
                                    href={route('teams.invoices.index', team.id)}
                                    className="inline-flex items-center text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    <span>Download past invoice receipts</span>
                                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
