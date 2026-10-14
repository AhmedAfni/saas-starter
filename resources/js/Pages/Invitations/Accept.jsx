import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Accept({ invitation }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const { post, processing } = useForm({});

    const handleAccept = (e) => {
        e.preventDefault();
        post(route('invitations.accept.post', invitation.token));
    };

    const article = /^[aeiou]/i.test(invitation.role) ? 'an' : 'a';

    return (
        <GuestLayout>
            <Head title={`Invitation to join ${invitation.team_name}`} />

            <div className="text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                </div>

                <h2 className="mt-3 text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Join {invitation.team_name}
                </h2>

                <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    You have been invited to join <span className="font-semibold text-slate-800 dark:text-slate-200">{invitation.team_name}</span> as {article}{' '}
                    <span className="font-semibold uppercase text-indigo-600 dark:text-indigo-400">{invitation.role}</span>.
                </p>

                <div className="my-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-left border border-slate-200 dark:border-slate-800">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Invited Email:</span> {invitation.email}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-medium text-slate-700 dark:text-slate-300">Valid until:</span> {new Date(invitation.expires_at).toLocaleDateString()}
                    </div>
                </div>

                {user ? (
                    <div>
                        {user.email.toLowerCase() === invitation.email.toLowerCase() ? (
                            <form onSubmit={handleAccept}>
                                <PrimaryButton className="w-full justify-center" disabled={processing}>
                                    {processing ? 'Joining...' : `Accept & Join ${invitation.team_name}`}
                                </PrimaryButton>
                            </form>
                        ) : (
                            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-3 text-xs text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                                You are signed in as <strong>{user.email}</strong>, but this invitation was sent to{' '}
                                <strong>{invitation.email}</strong>. Please switch accounts to accept.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Please log in or register with <strong>{invitation.email}</strong> to accept this invitation.
                        </p>

                        <div className="flex flex-col space-y-2">
                            <Link href={route('login')} className="w-full">
                                <PrimaryButton className="w-full justify-center">
                                    Log In to Accept
                                </PrimaryButton>
                            </Link>

                            <Link href={route('register')} className="w-full">
                                <SecondaryButton className="w-full justify-center">
                                    Create New Account
                                </SecondaryButton>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
