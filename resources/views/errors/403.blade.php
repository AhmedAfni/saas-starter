<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>403 - Forbidden | {{ config('app.name', 'SaaS Starter') }}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg">
    <script>
        (function() {
            var theme = localStorage.getItem('theme');
            var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (theme === 'dark' || (!theme && systemDark)) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        })();
    </script>
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body class="h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors">
    <header class="border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-6 py-4 flex items-center justify-between">
        <a href="/" class="flex items-center space-x-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm">
                S
            </div>
            <span class="text-base font-bold text-slate-900 dark:text-white tracking-tight">{{ config('app.name', 'SaaS Starter') }}</span>
        </a>
    </header>

    <main class="flex-1 flex items-center justify-center p-6">
        <div class="max-w-md w-full text-center space-y-6">
            <div class="flex flex-col items-center">
                <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900/50 shadow-sm mb-4">
                    <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                    </svg>
                </div>
                <span class="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-600/10 dark:ring-slate-700">
                    Error 403
                </span>
            </div>

            <div class="space-y-2">
                <h1 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    Access Forbidden
                </h1>
                <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    You do not have permission to view or manage this workspace resource.
                </p>
            </div>

            <div class="flex items-center justify-center gap-3 pt-2">
                <a href="/dashboard" class="inline-flex items-center space-x-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                    <span>Back to dashboard</span>
                </a>
                <a href="/" class="inline-flex items-center space-x-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                    <span>Home</span>
                </a>
            </div>
        </div>
    </main>

    <footer class="border-t border-slate-200/60 dark:border-slate-800/60 py-4 text-center text-xs text-slate-400 dark:text-slate-500">
        &copy; {{ date('Y') }} {{ config('app.name', 'SaaS Starter') }}. All rights reserved.
    </footer>
</body>
</html>
