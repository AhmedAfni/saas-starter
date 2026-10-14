import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Receipt,
    Menu,
    X,
    ChevronDown,
    Check,
    LogOut,
    User as UserIcon,
    Building2,
    ShieldCheck,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const currentTeam = user.current_team;
    const isOwner =
        user.current_team_id &&
        user.teams?.find((t) => t.id === user.current_team_id)?.pivot?.role === 'owner';

    const currentRole =
        user.teams?.find((t) => t.id === user.current_team_id)?.pivot?.role || 'member';

    const navItems = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: LayoutDashboard,
            show: true,
        },
        {
            name: 'Team Members',
            href: user.current_team_id ? route('teams.members.index', user.current_team_id) : '#',
            active: route().current('teams.members.index'),
            icon: Users,
            show: Boolean(user.current_team_id),
        },
        {
            name: 'Billing',
            href: user.current_team_id ? route('teams.billing.index', user.current_team_id) : '#',
            active: route().current('teams.billing.index'),
            icon: CreditCard,
            show: Boolean(isOwner),
        },
        {
            name: 'Invoices',
            href: user.current_team_id ? route('teams.invoices.index', user.current_team_id) : '#',
            active: route().current('teams.invoices.index'),
            icon: Receipt,
            show: Boolean(isOwner),
        },
    ];

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const sidebarContent = (
        <div className="flex h-full flex-col justify-between overflow-y-auto">
            <div>
                {/* Logo & App Name */}
                <div className="flex items-center space-x-3 px-6 py-5 border-b border-slate-100">
                    <Link href="/" className="flex items-center space-x-3 group">
                        <ApplicationLogo className="h-9 w-9 transition-transform group-hover:scale-105" />
                        <div>
                            <span className="text-base font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                                SaaS Starter
                            </span>
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-indigo-600">
                                Cloud Workspace
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Team Switcher */}
                {currentTeam && (
                    <div className="px-4 py-4 border-b border-slate-100">
                        <div className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Current Team
                        </div>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="group flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <div className="flex items-center min-w-0 space-x-2.5">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm">
                                            {currentTeam.name ? currentTeam.name.charAt(0).toUpperCase() : 'T'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-xs font-semibold text-slate-800">
                                                {currentTeam.name}
                                            </div>
                                            <div className="flex items-center space-x-1 text-[11px] capitalize text-slate-500">
                                                <span>{currentRole}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-hover:text-slate-600" />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="left" width="60" contentClasses="p-1.5 bg-white rounded-xl shadow-lg border border-slate-100">
                                <div className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    Switch Workspace
                                </div>
                                <div className="space-y-0.5">
                                    {user.teams?.map((team) => {
                                        const isSelected = team.id === user.current_team_id;
                                        return (
                                            <Dropdown.Link
                                                key={team.id}
                                                href={route('teams.current.update')}
                                                method="put"
                                                data={{ team_id: team.id }}
                                                as="button"
                                                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs font-medium text-left transition ${
                                                    isSelected
                                                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                                                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                                                }`}
                                            >
                                                <span className="truncate">{team.name}</span>
                                                {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0 ml-2" />}
                                            </Dropdown.Link>
                                        );
                                    })}
                                </div>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                )}

                {/* Navigation Links */}
                <div className="px-3 py-4">
                    <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Navigation
                    </div>
                    <nav className="space-y-1">
                        {navItems
                            .filter((item) => item.show)
                            .map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                                            item.active
                                                ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                                                : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                                        }`}
                                    >
                                        <Icon
                                            className={`mr-3 h-5 w-5 shrink-0 transition-colors ${
                                                item.active
                                                    ? 'text-indigo-600'
                                                    : 'text-slate-400 group-hover:text-slate-600'
                                            }`}
                                        />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                    </nav>
                </div>
            </div>

            {/* User Menu at Bottom */}
            <div className="border-t border-slate-100 p-3 bg-white">
                <Dropdown>
                    <Dropdown.Trigger>
                        <button
                            type="button"
                            className="group flex w-full items-center justify-between rounded-xl p-2 text-left transition hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                        >
                            <div className="flex items-center min-w-0 space-x-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs font-semibold text-white shadow-sm ring-2 ring-white">
                                    {getInitials(user.name)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-[11px] text-slate-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-600" />
                        </button>
                    </Dropdown.Trigger>

                    <Dropdown.Content align="top-left" width="56" contentClasses="p-1.5 bg-white rounded-xl shadow-lg border border-slate-100 mb-2">
                        <div className="px-3 py-2 border-b border-slate-100 mb-1">
                            <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        </div>
                        <Dropdown.Link
                            href={route('profile.edit')}
                            className="flex items-center rounded-lg px-2.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                        >
                            <UserIcon className="mr-2 h-4 w-4 text-slate-400" />
                            Account Profile
                        </Dropdown.Link>
                        <Dropdown.Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full items-center rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <LogOut className="mr-2 h-4 w-4 text-red-500" />
                            Sign Out
                        </Dropdown.Link>
                    </Dropdown.Content>
                </Dropdown>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/60 font-sans text-slate-900 antialiased">
            {/* Desktop Left Sidebar */}
            <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-64 md:flex-col border-r border-slate-200/80 bg-white shadow-sm">
                {sidebarContent}
            </aside>

            {/* Mobile Header Bar */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white px-4 md:hidden">
                <Link href="/" className="flex items-center space-x-2.5">
                    <ApplicationLogo className="h-8 w-8" />
                    <span className="text-base font-bold tracking-tight text-slate-900">
                        SaaS Starter
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(true)}
                    className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    aria-label="Open mobile navigation"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </header>

            {/* Mobile Sidebar Overlay Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="fixed inset-y-0 left-0 flex w-72 max-w-full flex-col bg-white shadow-2xl">
                        <div className="absolute right-3 top-3">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                aria-label="Close navigation"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        {sidebarContent}
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col md:pl-64">
                {header && (
                    <header className="border-b border-slate-200/80 bg-white">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="flex-1 py-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
