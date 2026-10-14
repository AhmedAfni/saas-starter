import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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
    Loader2,
    RefreshCw,
    AlertCircle,
} from 'lucide-react';

export default function Billing({ team, isSubscribed, subscription, memberCount, totalSeatsTaken, maxFreeSeats }) {
    const { flash } = usePage().props;

    const { post: postSubscribe, processing: subscribing } = useForm({});
    const { post: postPortal, processing: loadingPortal } = useForm({});

    const [pollCount, setPollCount] = useState(0);
    const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('checkout') === 'success') {
                setIsCheckoutSuccess(true);
            }
        }
    }, []);

    useEffect(() => {
        if (isCheckoutSuccess && !isSubscribed && pollCount < 10) {
            const timer = setTimeout(() => {
                router.reload({
                    only: ['isSubscribed', 'subscription'],
                    onSuccess: () => {
                        setPollCount((prev) => prev + 1);
                    },
                    onError: () => {
                        setPollCount((prev) => prev + 1);
                    },
                });
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isCheckoutSuccess, isSubscribed, pollCount]);

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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Billing & Subscription
                            </h2>
                            <span className="text-slate-400 dark:text-slate-600 font-normal">&bull;</span>
                            <span className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">{team.name}</span>
                        </div>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Manage workspace plans, seat capacity, and automated invoicing.
                        </p>
                    </div>

                    <div>
                        <Link
                            href={route('teams.invoices.index', team.id)}
                            className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300"
                        >
                            <FileText className="mr-1.5 h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                            <span>Billing Invoices &rarr;</span>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Billing - ${team.name}`} />

            <div className="space-y-6">
                {/* Polling / Activation Banner */}
                {isCheckoutSuccess && !isSubscribed && (
                    pollCount < 10 ? (
                        <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/50 p-4 border border-indigo-200/80 dark:border-indigo-800/80 flex items-center justify-between space-x-3 text-indigo-900 dark:text-indigo-200">
                            <div className="flex items-center space-x-3">
                                <Loader2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold">Payment received, activating your plan...</p>
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5">Checking subscription status with Stripe (attempt {pollCount + 1}/10)...</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-xl bg-amber-50 dark:bg-amber-950/50 p-4 border border-amber-200/80 dark:border-amber-800/80 flex items-center justify-between space-x-3 text-amber-900 dark:text-amber-200">
                            <div className="flex items-center space-x-3">
                                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold">Still activating, refresh in a moment</p>
                                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">Stripe webhooks may take a few seconds to deliver in background.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.reload()}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm transition focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                <span>Refresh</span>
                            </button>
                        </div>
                    )
                )}

                {/* Polling Success Banner */}
                {isCheckoutSuccess && isSubscribed && (
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-4 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center space-x-3 text-emerald-800 dark:text-emerald-200">
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <div>
                            <p className="text-sm font-semibold">Subscription successfully activated!</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Your team has full access to unlimited seats and Pro features.</p>
                        </div>
                    </div>
                )}

                {/* Flash Message */}
                {flash?.status && (
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3.5 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center space-x-3 text-emerald-800 dark:text-emerald-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <p className="text-xs sm:text-sm font-medium">{flash.status}</p>
                    </div>
                )}

                {/* Plan Card Overview */}
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    {/* Plan Header */}
                    <div className="border-b border-slate-100 dark:border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-slate-50/60 to-white dark:from-slate-850 dark:to-slate-900">
                        <div className="flex items-center space-x-3.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-2.5">
                                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                                        {isSubscribed ? 'Pro Plan' : 'Free Plan'}
                                    </h3>
                                    {isSubscribed ? (
                                        <span className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20 dark:ring-emerald-500/30">
                                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                                            Active Subscription
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-600/10 dark:ring-slate-700">
                                            Free Plan
                                        </span>
                                    )}
                                </div>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
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
                                        className="rounded-lg px-3.5 py-2 text-xs"
                                    >
                                        <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                                        {loadingPortal ? 'Opening Portal...' : 'Manage via Stripe Portal'}
                                    </SecondaryButton>
                                </form>
                            ) : (
                                <form onSubmit={handleSubscribe}>
                                    <PrimaryButton
                                        type="submit"
                                        disabled={subscribing}
                                        className="rounded-lg px-4 py-2 text-xs"
                                    >
                                        <Zap className="mr-1.5 h-3.5 w-3.5" />
                                        {subscribing ? 'Connecting...' : 'Upgrade to Pro'}
                                    </PrimaryButton>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Plan Details & Seats Usage */}
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Member Seats Card */}
                        <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-4 sm:p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Member Seats Capacity
                                    </span>
                                    <Users className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                                </div>

                                <div className="mt-3 flex items-baseline space-x-2">
                                    <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        {totalSeatsTaken}
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                                        / {isSubscribed ? 'Unlimited' : `${maxFreeSeats} max free seats`}
                                    </span>
                                </div>

                                <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{memberCount}</span> active member{memberCount === 1 ? '' : 's'} +{' '}
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.max(0, totalSeatsTaken - memberCount)}</span> pending invitation{totalSeatsTaken - memberCount === 1 ? '' : 's'}.
                                </p>

                                {/* Progress Bar */}
                                {!isSubscribed ? (
                                    <div className="mt-4 space-y-1.5">
                                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                                            <span>Used capacity</span>
                                            <span>{percentUsed}%</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${
                                                    isAtOrOverCapacity ? 'bg-amber-500' : 'bg-indigo-600'
                                                }`}
                                                style={{ width: `${percentUsed}%` }}
                                            />
                                        </div>
                                        {isAtOrOverCapacity && (
                                            <p className="text-xs font-medium text-amber-600 dark:text-amber-400 pt-1">
                                                Seat limit reached. Upgrade to Pro for unlimited team collaboration.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="mt-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-2.5 border border-emerald-100 dark:border-emerald-900/50 flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 text-xs">
                                        <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                        <span>Unlimited seat capacity is unlocked with your active Pro Plan.</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Plan Features Included */}
                        <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 flex flex-col justify-between">
                            <div>
                                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Included Features
                                </span>

                                <ul className="mt-3 space-y-2.5">
                                    <li className="flex items-center text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                        <div className="mr-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </div>
                                        <span>{isSubscribed ? 'Unlimited team members' : 'Up to 3 team members free'}</span>
                                    </li>
                                    <li className="flex items-center text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                        <div className="mr-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </div>
                                        <span>Multi-tenant workspace isolation</span>
                                    </li>
                                    <li className="flex items-center text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                        <div className="mr-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </div>
                                        <span>Role-based permissions (Owner, Admin, Member)</span>
                                    </li>
                                    <li className="flex items-center text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                        <div className="mr-2.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                        </div>
                                        <span>Automated billing & PDF invoice downloads</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={route('teams.invoices.index', team.id)}
                                    className="inline-flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
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
