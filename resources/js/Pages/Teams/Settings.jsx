import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Building2, CheckCircle2 } from 'lucide-react';

export default function Settings({ team, isOwner }) {
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: team.name,
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('teams.settings.update', team.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Team Settings
                            </h2>
                            <span className="text-slate-400 dark:text-slate-600 font-normal">&bull;</span>
                            <span className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
                                {team.name}
                            </span>
                        </div>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Manage workspace identity, organization name, and preferences.
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-sm text-xs text-slate-600 dark:text-slate-300">
                        <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Workspace ID: #{team.id}</span>
                    </div>
                </div>
            }
        >
            <Head title={`Settings - ${team.name}`} />

            <div className="space-y-6">
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm max-w-xl">
                    <header className="border-b border-slate-100 dark:border-slate-800 pb-3.5 mb-5">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                            Rename Workspace
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Update the official name of this team workspace displayed to all members.
                        </p>
                    </header>

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="team-name" value="Workspace Name" />
                            <TextInput
                                id="team-name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full text-sm"
                                required
                            />
                            <InputError message={errors.name} className="mt-1.5" />
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <PrimaryButton disabled={processing} className="px-4 py-2 text-xs">
                                {processing ? 'Saving...' : 'Save Changes'}
                            </PrimaryButton>

                            {recentlySuccessful && (
                                <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                                    Saved
                                </span>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
