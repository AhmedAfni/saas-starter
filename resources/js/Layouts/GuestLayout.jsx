import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50/70 p-4 sm:p-6 antialiased font-sans">
            <div className="w-full max-w-md mb-6 text-center">
                <Link href="/" className="inline-flex items-center space-x-3 group">
                    <ApplicationLogo className="h-10 w-10 transition-transform group-hover:scale-105" />
                    <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                        SaaS Starter
                    </span>
                </Link>
            </div>

            <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 sm:p-10 shadow-sm">
                {children}
            </div>

            <div className="mt-8 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} SaaS Starter Inc. All rights reserved.
            </div>
        </div>
    );
}
