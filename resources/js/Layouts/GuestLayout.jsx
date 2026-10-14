import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative min-h-screen flex flex-col justify-center items-center bg-slate-50/70 dark:bg-slate-950 p-4 sm:p-6 antialiased font-sans text-slate-900 dark:text-slate-100 transition-colors">
            {/* Top right theme toggle */}
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-md mb-6 text-center">
                <Link href="/" className="inline-flex items-center space-x-2.5 group">
                    <ApplicationLogo className="h-9 w-9 transition-transform group-hover:scale-105" />
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        SaaS Starter
                    </span>
                </Link>
            </div>

            <div className="w-full max-w-md rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
                {children}
            </div>

            <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
                &copy; {new Date().getFullYear()} SaaS Starter Inc. All rights reserved.
            </div>
        </div>
    );
}
