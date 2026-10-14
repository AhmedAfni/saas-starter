import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Users,
    CreditCard,
    Shield,
    Sparkles,
    ArrowUpRight,
    Building2,
    CheckCircle2,
} from 'lucide-react';

export default function Dashboard() {
    const { auth } = usePage().props;
    const user = auth.user;

    const currentTeam = user.current_team;
    const currentRole =
        user.teams?.find((t) => t.id === user.current_team_id)?.pivot?.role || 'member';

    const isOwner = currentRole === 'owner';

    const roleBadgeStyles = {
        owner: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20 dark:bg-purple-950/50 dark:text-purple-300 dark:ring-purple-500/30',
        admin: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-950/50 dark:text-indigo-300 dark:ring-indigo-500/30',
        member: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/10 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Dashboard
                        </h2>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Welcome back, <span className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</span>. Here is an overview of your active workspace.
                        </p>
                    </div>

                    {currentTeam && (
                        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 shadow-sm">
                            <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Team:</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{currentTeam.name}</span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                                    roleBadgeStyles[currentRole] || roleBadgeStyles.member
                                }`}
                            >
                                {currentRole}
                            </span>
                        </div>
                    )}
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Hero / Quick Status Banner */}
                <div className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-5 sm:p-6 text-white shadow-sm relative">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-0.5 text-xs font-medium text-indigo-200 mb-3 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                            <span>Multi-tenant SaaS Architecture</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                            Your workspace is active and secured.
                        </h3>
                        <p className="mt-1.5 text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
                            Manage team members, control role-based access, and configure subscriptions seamlessly from your central dashboard.
                        </p>
                    </div>
                </div>

                {/* Quick Action Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Team Members Card */}
                    {user.current_team_id && (
                        <div className="group flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md">
                            <div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 transition group-hover:bg-indigo-600 group-hover:text-white">
                                    <Users className="h-5 w-5" />
                                </div>
                                <h4 className="mt-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                    Team Collaboration
                                </h4>
                                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    Invite colleagues, manage roles, and monitor team invitations.
                                </p>
                            </div>
                            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={route('teams.members.index', user.current_team_id)}
                                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                >
                                    <span>Manage Members</span>
                                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Billing Card (or overview) */}
                    {isOwner ? (
                        <div className="group flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md">
                            <div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 transition group-hover:bg-emerald-600 group-hover:text-white">
                                    <CreditCard className="h-5 w-5" />
                                </div>
                                <h4 className="mt-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                    Subscription & Billing
                                </h4>
                                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    Review member seat limits, billing invoices, and Stripe portal.
                                </p>
                            </div>
                            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                                <Link
                                    href={route('teams.billing.index', user.current_team_id)}
                                    className="inline-flex items-center text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                                >
                                    <span>View Billing</span>
                                    <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="group flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                            <div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <h4 className="mt-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                    Role Permissions
                                </h4>
                                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                    You have <span className="font-semibold capitalize text-slate-800 dark:text-slate-200">{currentRole}</span> access to collaborate within this team workspace.
                                </p>
                            </div>
                            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-xs text-slate-400 dark:text-slate-500">Owner manages billing</span>
                            </div>
                        </div>
                    )}

                    {/* Account Settings Card */}
                    <div className="group flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:shadow-md">
                        <div>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 transition group-hover:bg-purple-600 group-hover:text-white">
                                <Shield className="h-5 w-5" />
                            </div>
                            <h4 className="mt-3 text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                Profile & Security
                            </h4>
                            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                                Update your personal details, email credentials, and security password.
                            </p>
                        </div>
                        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex items-center text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                            >
                                <span>Account Settings</span>
                                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Workspace Details Card */}
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                                <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                    Workspace Status
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Multi-tenant isolation and role-based controls
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="rounded-lg bg-slate-50/70 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">Active User</span>
                            <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50/70 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">Current Team</span>
                            <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">{currentTeam?.name || 'Personal'}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">ID: #{user.current_team_id || 'None'}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50/70 dark:bg-slate-800/60 p-3.5 border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-semibold uppercase text-slate-400 dark:text-slate-500">Access Level</span>
                            <p className="mt-1 text-xs sm:text-sm font-semibold capitalize text-indigo-600 dark:text-indigo-400">{currentRole}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Role-based controls active</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
