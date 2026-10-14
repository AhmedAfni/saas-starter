import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    ShieldCheck,
    CreditCard,
    Receipt,
    ArrowRight,
    Sparkles,
    CheckCircle2,
    Building2,
    Layers,
} from 'lucide-react';

export default function Welcome() {
    const features = [
        {
            name: 'Multi-Tenant Teams',
            description:
                'Strict tenant data isolation out of the box. Users can create, switch, and collaborate across separate team workspaces effortlessly.',
            icon: Users,
            badge: 'Teams',
        },
        {
            name: 'Role-Based Permissions',
            description:
                'Granular control with Owner, Admin, and Member roles. Secure team invitation tokens and fine-grained authorization policies.',
            icon: ShieldCheck,
            badge: 'Roles',
        },
        {
            name: 'Stripe Billing & Subscriptions',
            description:
                'Seamless integration with Stripe Checkout and customer portal. Free member seat limits with automatic upgrade pathways.',
            icon: CreditCard,
            badge: 'Stripe Billing',
        },
        {
            name: 'Automated Tax Invoices',
            description:
                'Real-time billing history and payment receipt records. Team owners can download official hosted invoice PDFs on demand.',
            icon: Receipt,
            badge: 'Invoices',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors">
            <Head title="SaaS Starter - Modern Multi-Tenant Cloud Workspace" />

            {/* Navigation Bar */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center space-x-2.5 group">
                        <ApplicationLogo className="h-8 w-8 transition-transform group-hover:scale-105" />
                        <div>
                            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                SaaS Starter
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-3">
                        <ThemeToggle />

                        <Link
                            href={route('login')}
                            className="rounded-lg px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                        >
                            Sign In
                        </Link>

                        <Link
                            href={route('register')}
                            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition"
                        >
                            <span>Register</span>
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-6 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Production-Ready Multi-Tenant Architecture</span>
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900 dark:text-white leading-tight">
                            The complete foundation for modern software teams.
                        </h1>

                        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
                            Multi-tenant workspaces, granular role-based permissions, automated Stripe billing, and tax invoice downloads — built right into one unified platform.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href={route('register')}
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                            >
                                <span>Get Started for Free</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>

                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition"
                            >
                                Sign in to Workspace
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature List Section */}
            <section className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/40">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Core Capabilities
                        </h2>
                        <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            Engineered for scalable multi-tenancy
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.name}
                                    className="group rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm transition hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition group-hover:bg-indigo-600 group-hover:text-white">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                                            {feature.badge}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-white">
                                        {feature.name}
                                    </h3>
                                    <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="py-12 border-t border-slate-200/80 dark:border-slate-800">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-center text-white shadow-md relative overflow-hidden">
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                            Ready to explore your new workspace?
                        </h2>
                        <p className="mt-2 text-xs sm:text-sm text-indigo-200 max-w-lg mx-auto">
                            Sign up today or test drive the application with our pre-seeded demo accounts.
                        </p>
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href={route('register')}
                                className="rounded-lg bg-white px-5 py-2.5 text-xs sm:text-sm font-semibold text-indigo-700 shadow-sm hover:bg-slate-100 transition"
                            >
                                Create Free Account
                            </Link>
                            <Link
                                href={route('login')}
                                className="rounded-lg border border-indigo-400/30 bg-indigo-800/40 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-indigo-800/60 transition"
                            >
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200/80 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400">
                <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                        <ApplicationLogo className="h-5 w-5" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">SaaS Starter</span>
                    </div>
                    <div>
                        &copy; {new Date().getFullYear()} SaaS Starter Inc. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
