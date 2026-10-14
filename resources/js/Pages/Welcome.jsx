import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link } from '@inertiajs/react';
import {
    Users,
    ShieldCheck,
    UserPlus,
    CreditCard,
    Receipt,
    Lock,
    ArrowRight,
    Check,
    CheckCircle2,
    Building2,
    Sparkles,
} from 'lucide-react';

export default function Welcome() {
    const features = [
        {
            name: 'Teams',
            description:
                'Multi-tenant workspace architecture. Create personal and collaborative teams with seamless switching in one click.',
            icon: Users,
        },
        {
            name: 'Roles and permissions',
            description:
                'Strict authorization policies separating Owner, Admin, and Member capabilities across workspace resources.',
            icon: ShieldCheck,
        },
        {
            name: 'Invitations',
            description:
                'Secure email invitation links with cryptographic tokens and automated seat assignment upon acceptance.',
            icon: UserPlus,
        },
        {
            name: 'Stripe subscriptions',
            description:
                'Stripe Checkout flow and self-serve customer billing portal with automated subscription state handling.',
            icon: CreditCard,
        },
        {
            name: 'Invoices',
            description:
                'Direct access to official billing receipts with downloadable hosted PDF tax invoice records on demand.',
            icon: Receipt,
        },
        {
            name: 'Tenant data isolation',
            description:
                'Global database scopes prevent tenant cross-contamination, ensuring complete data security between teams.',
            icon: Lock,
        },
    ];

    const steps = [
        {
            step: '01',
            title: 'Create your team workspace',
            description: 'Sign up in seconds. Your initial team workspace is provisioned automatically with Owner privileges.',
        },
        {
            step: '02',
            title: 'Invite members & assign roles',
            description: 'Send invitation links to teammates with specific Admin or Member access controls.',
        },
        {
            step: '03',
            title: 'Scale & manage billing',
            description: 'Stay on the free plan with up to 3 seats or unlock unlimited collaboration via Stripe for $10/month.',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased selection:bg-indigo-500 selection:text-white transition-colors">
            <Head title="SaaS Starter - Multi-Tenant Workspace & Subscription Platform" />

            {/* Sticky Navigation Bar */}
            <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <Link href="/" className="flex items-center space-x-2.5 group">
                        <ApplicationLogo className="h-8 w-8 transition-transform group-hover:scale-105" />
                        <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            SaaS Starter
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center space-x-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
                        <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                            Features
                        </a>
                        <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                            How it works
                        </a>
                        <a href="#pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                            Pricing
                        </a>
                    </nav>

                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <ThemeToggle />

                        <Link
                            href={route('login')}
                            className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            Sign in
                        </Link>

                        <Link
                            href={route('register')}
                            className="inline-flex items-center rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition"
                        >
                            <span>Get started</span>
                            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center space-x-2 rounded-full border border-indigo-200/80 dark:border-indigo-800/80 bg-indigo-50/80 dark:bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-5 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Multi-tenant architecture with Stripe billing</span>
                        </div>

                        <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-slate-900 dark:text-white leading-tight">
                            The complete foundation for modern team software.
                        </h1>

                        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
                            Manage multi-tenant teams, role-based permissions, automated Stripe subscriptions, and invoice downloads — ready out of the box.
                        </p>

                        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href={route('register')}
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition"
                            >
                                <span>Get started free</span>
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>

                            <Link
                                href={route('login')}
                                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition"
                            >
                                Sign in to workspace
                            </Link>
                        </div>
                    </div>

                    {/* Live HTML/CSS Product Preview */}
                    <div className="mt-12 mx-auto max-w-4xl">
                        <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/5">
                            {/* Window Topbar */}
                            <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 px-4 py-3 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400 inline-block" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 inline-block" />
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 inline-block" />
                                    <span className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        app.saas-starter.test / Acme Corp Workspace
                                    </span>
                                </div>
                                <div className="inline-flex items-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-inset ring-emerald-600/20">
                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Pro Subscription Active
                                </div>
                            </div>

                            {/* Window Content */}
                            <div className="p-5 sm:p-6 space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                                                Team Members
                                            </h3>
                                            <span className="text-slate-400 font-normal">&bull;</span>
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                                                Acme Corp
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            3 collaborators with active workspace seats
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                            Seat Limit:
                                        </span>
                                        <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                            Unlimited (Pro)
                                        </span>
                                    </div>
                                </div>

                                {/* Table Mockup */}
                                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                                    <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800 text-left text-xs">
                                        <thead className="bg-slate-50/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase text-[10px] font-semibold">
                                            <tr>
                                                <th className="px-4 py-2.5">Member</th>
                                                <th className="px-4 py-2.5">Email</th>
                                                <th className="px-4 py-2.5">Role</th>
                                                <th className="px-4 py-2.5 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                                                    <span className="h-6 w-6 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                                                        AO
                                                    </span>
                                                    <span>Alice Owner</span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">owner@acme.com</td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-purple-50 dark:bg-purple-950/50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:text-purple-300">
                                                        Owner
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                                                    Active
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                                                    <span className="h-6 w-6 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
                                                        BA
                                                    </span>
                                                    <span>Bob Admin</span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">admin@acme.com</td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                                                        Admin
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                                                    Active
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white flex items-center space-x-2">
                                                    <span className="h-6 w-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                                                        CM
                                                    </span>
                                                    <span>Charlie Member</span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">member@acme.com</td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                                        Member
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400 font-medium">
                                                    Active
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid Section (6 cards) */}
            <section id="features" className="py-14 sm:py-20 border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Features
                        </h2>
                        <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            Six pillars of enterprise multi-tenancy
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.name}
                                    className="group rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition group-hover:bg-indigo-600 group-hover:text-white">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h3 className="mt-4 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
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

            {/* How It Works (3 Steps) */}
            <section id="how-it-works" className="py-14 sm:py-20 border-t border-slate-200/80 dark:border-slate-800">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Workflow
                        </h2>
                        <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            How it works in three steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((item) => (
                            <div
                                key={item.step}
                                className="relative rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
                            >
                                <span className="text-3xl font-extrabold text-indigo-600/30 dark:text-indigo-400/20">
                                    {item.step}
                                </span>
                                <h3 className="mt-3 text-base font-semibold text-slate-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-14 sm:py-20 border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                            Pricing
                        </h2>
                        <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                            Simple, transparent plans for any team
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {/* Free Tier */}
                        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-sm">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                    Free Plan
                                </span>
                                <div className="mt-3 flex items-baseline space-x-1">
                                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$0</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">/ forever</span>
                                </div>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    Perfect for small teams and initial evaluation.
                                </p>

                                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
                                        <span>Up to 3 team members</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
                                        <span>Multi-tenant workspace isolation</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
                                        <span>Role permissions (Owner, Admin, Member)</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-emerald-600 shrink-0" />
                                        <span>Workspace project management</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8">
                                <Link
                                    href={route('register')}
                                    className="block w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 text-center text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                >
                                    Get started free
                                </Link>
                            </div>
                        </div>

                        {/* Pro Tier */}
                        <div className="relative rounded-2xl border-2 border-indigo-600 dark:border-indigo-500 bg-white dark:bg-slate-900 p-6 flex flex-col justify-between shadow-md">
                            <div className="absolute -top-3 right-6 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                                Recommended
                            </div>

                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                    Pro Plan
                                </span>
                                <div className="mt-3 flex items-baseline space-x-1">
                                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$10</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">/ month</span>
                                </div>
                                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                    Unlimited collaboration for growing software companies.
                                </p>

                                <ul className="mt-6 space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                                    <li className="flex items-center font-semibold text-slate-900 dark:text-white">
                                        <Check className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        <span>Unlimited team members</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        <span>Stripe customer billing portal</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        <span>Downloadable PDF tax invoices</span>
                                    </li>
                                    <li className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                                        <span>Priority tenant routing</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="mt-8">
                                <Link
                                    href={route('register')}
                                    className="block w-full rounded-xl bg-indigo-600 py-2.5 text-center text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition"
                                >
                                    Start with Pro
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200/80 dark:border-slate-800 py-8 text-xs text-slate-500 dark:text-slate-400">
                <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center space-x-2.5">
                        <ApplicationLogo className="h-5 w-5" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">SaaS Starter</span>
                    </div>

                    <div className="text-center">
                        Built with Laravel, React and Stripe (test mode)
                    </div>

                    <div>
                        &copy; {new Date().getFullYear()} SaaS Starter. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
