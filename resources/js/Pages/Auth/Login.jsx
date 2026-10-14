import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { demoMode = false } = usePage().props;
    const [demoLoading, setDemoLoading] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleDemoLogin = (role) => {
        setDemoLoading(role);
        router.post(
            route('demo.login'),
            { role },
            {
                onFinish: () => setDemoLoading(null),
            }
        );
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-6">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Welcome back
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Enter your email and password to access your team workspace.
                </p>
            </div>

            {status && (
                <div className="mb-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email Address" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full rounded-lg text-sm"
                        autoComplete="username"
                        placeholder="you@company.com"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div>
                    <div className="flex items-center justify-between">
                        <InputLabel htmlFor="password" value="Password" />
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full rounded-lg text-sm"
                        autoComplete="current-password"
                        placeholder="••••••••"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-xs text-slate-600 dark:text-slate-400">
                            Remember for 30 days
                        </span>
                    </label>
                </div>

                <div className="pt-2">
                    <PrimaryButton className="w-full py-2.5 text-sm" disabled={processing}>
                        {processing ? 'Signing in...' : 'Sign in to account'}
                    </PrimaryButton>
                </div>

                {demoMode && (
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="mb-2 text-center">
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Demo Login (Acme Corp)
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('owner')}
                                disabled={demoLoading !== null}
                                className="flex flex-col items-center justify-center rounded-lg border border-purple-200 dark:border-purple-900/60 bg-purple-50/60 dark:bg-purple-950/30 p-2 text-center transition hover:bg-purple-100 dark:hover:bg-purple-900/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20 disabled:opacity-50"
                            >
                                <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                                    {demoLoading === 'owner' ? 'Signing in...' : 'Owner'}
                                </span>
                                <span className="text-[10px] text-purple-600/70 dark:text-purple-400/70">
                                    Alice
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoLogin('admin')}
                                disabled={demoLoading !== null}
                                className="flex flex-col items-center justify-center rounded-lg border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 p-2 text-center transition hover:bg-indigo-100 dark:hover:bg-indigo-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                            >
                                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                    {demoLoading === 'admin' ? 'Signing in...' : 'Admin'}
                                </span>
                                <span className="text-[10px] text-indigo-600/70 dark:text-indigo-400/70">
                                    Bob
                                </span>
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDemoLogin('member')}
                                disabled={demoLoading !== null}
                                className="flex flex-col items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-center transition hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                            >
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                                    {demoLoading === 'member' ? 'Signing in...' : 'Member'}
                                </span>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                    Charlie
                                </span>
                            </button>
                        </div>
                    </div>
                )}

                <div className="pt-3 text-center border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Don't have an account yet?{' '}
                        <Link
                            href={route('register')}
                            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline"
                        >
                            Sign up for free
                        </Link>
                    </p>
                </div>
            </form>
        </GuestLayout>
    );
}
