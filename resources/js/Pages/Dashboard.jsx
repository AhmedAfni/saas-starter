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
        owner: 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-600/20',
        admin: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20',
        member: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-600/10',
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                            Dashboard
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Welcome back, <span className="font-semibold text-slate-800">{user.name}</span>. Here is an overview of your active workspace.
                        </p>
                    </div>

                    {currentTeam && (
                        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 shadow-sm">
                            <Building2 className="h-4 w-4 text-indigo-600" />
                            <span className="text-xs font-medium text-slate-500">Team:</span>
                            <span className="text-xs font-bold text-slate-800">{currentTeam.name}</span>
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

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Hero / Quick Status Banner */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-sm relative">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center space-x-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-3 py-1 text-xs font-medium text-indigo-200 mb-4 backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                            <span>Multi-tenant SaaS Architecture</span>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight sm:text-3xl text-white">
                            Your workspace is active and secured.
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-indigo-100/80 leading-relaxed">
                            Manage team members, control role-based access, and configure subscriptions seamlessly from your central dashboard.
                        </p>
                    </div>
                </div>

                {/* Quick Action Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Team Members Card */}
                    {user.current_team_id && (
                        <div className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                                    <Users className="h-6 w-6" />
                                </div>
                                <h4 className="mt-4 text-base font-semibold text-slate-900">
                                    Team Collaboration
                                </h4>
                                <p className="mt-1 text-sm text-slate-500">
                                    Invite colleagues, manage roles, and monitor team invitations.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <Link
                                    href={route('teams.members.index', user.current_team_id)}
                                    className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    <span>Manage Members</span>
                                    <ArrowUpRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Billing Card (or overview) */}
                    {isOwner ? (
                        <div className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                                    <CreditCard className="h-6 w-6" />
                                </div>
                                <h4 className="mt-4 text-base font-semibold text-slate-900">
                                    Subscription & Billing
                                </h4>
                                <p className="mt-1 text-sm text-slate-500">
                                    Review member seat limits, billing invoices, and Stripe portal.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <Link
                                    href={route('teams.billing.index', user.current_team_id)}
                                    className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    <span>View Billing</span>
                                    <ArrowUpRight className="ml-1 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
                            <div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                    <Shield className="h-6 w-6" />
                                </div>
                                <h4 className="mt-4 text-base font-semibold text-slate-900">
                                    Role Permissions
                                </h4>
                                <p className="mt-1 text-sm text-slate-500">
                                    You have <span className="font-semibold capitalize text-slate-800">{currentRole}</span> access to collaborate within this team workspace.
                                </p>
                            </div>
                            <div className="mt-6 pt-4 border-t border-slate-100">
                                <span className="text-xs text-slate-400">Owner manages billing</span>
                            </div>
                        </div>
                    )}

                    {/* Account Settings Card */}
                    <div className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
                        <div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-600 group-hover:text-white">
                                <Shield className="h-6 w-6" />
                            </div>
                            <h4 className="mt-4 text-base font-semibold text-slate-900">
                                Profile & Security
                            </h4>
                            <p className="mt-1 text-sm text-slate-500">
                                Update your personal details, email credentials, and security password.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-100">
                            <Link
                                href={route('profile.edit')}
                                className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                <span>Account Settings</span>
                                <ArrowUpRight className="ml-1 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Workspace Details Card */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <div className="flex items-center space-x-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                            <div>
                                <h4 className="text-base font-semibold text-slate-900">
                                    Workspace Status
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Multi-tenant tenant isolation and authorization status
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="rounded-lg bg-slate-50/70 p-4 border border-slate-100">
                            <span className="text-xs font-semibold uppercase text-slate-400">Active User</span>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{user.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50/70 p-4 border border-slate-100">
                            <span className="text-xs font-semibold uppercase text-slate-400">Current Team</span>
                            <p className="mt-1 text-sm font-semibold text-slate-900">{currentTeam?.name || 'Personal'}</p>
                            <p className="text-xs text-slate-500">ID: #{user.current_team_id || 'None'}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50/70 p-4 border border-slate-100">
                            <span className="text-xs font-semibold uppercase text-slate-400">Access Level</span>
                            <p className="mt-1 text-sm font-semibold capitalize text-indigo-600">{currentRole}</p>
                            <p className="text-xs text-slate-500">Role-based controls active</p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
