import { Head, Link } from '@inertiajs/react';
import ThemeToggle from '@/Components/ThemeToggle';
import { ShieldAlert, FileQuestion, ArrowLeft, Home, LayoutDashboard } from 'lucide-react';

export default function Error({ status = 404, message }) {
    const title = {
        403: 'Access Forbidden',
        404: 'Page Not Found',
        500: 'Server Error',
        503: 'Service Unavailable',
    }[status] || 'An Error Occurred';

    const description = message || {
        403: 'You do not have permission to view or manage this workspace resource.',
        404: 'The page or resource you are looking for could not be found or has been moved.',
        500: 'Whoops, something went wrong on our servers. Please try again shortly.',
        503: 'We are currently performing maintenance. Please check back soon.',
    }[status] || 'An unexpected error occurred.';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors selection:bg-indigo-500 selection:text-white">
            <Head title={`${status}: ${title}`} />

            {/* Top Navigation Bar */}
            <header className="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
                        S
                    </div>
                    <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight">SaaS Starter</span>
                </Link>

                <div className="flex items-center space-x-3">
                    <ThemeToggle />
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-md w-full text-center space-y-6">
                    {/* Status Badge & Icon */}
                    <div className="flex flex-col items-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 shadow-sm mb-4">
                            {status === 403 ? (
                                <ShieldAlert className="h-8 w-8" />
                            ) : (
                                <FileQuestion className="h-8 w-8" />
                            )}
                        </div>
                        <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-600/10 dark:ring-slate-700">
                            Error {status}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {title}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                            {description}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                        <Link
                            href={route('dashboard')}
                            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition"
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Back to dashboard</span>
                        </Link>
                        <Link
                            href="/"
                            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        >
                            <Home className="h-4 w-4" />
                            <span>Home</span>
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="border-t border-slate-200/60 dark:border-slate-800/60 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
                &copy; {new Date().getFullYear()} SaaS Starter. All rights reserved.
            </footer>
        </div>
    );
}
