import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';
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
        <div className="flex h-full flex-col justify-between overflow-y-auto bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
            <div>
                {/* Logo & App Name */}
                <div className="flex items-center space-x-3 px-5 py-4 border-b border-slate-200/80 dark:border-slate-800">
                    <Link href="/" className="flex items-center space-x-2.5 group">
                        <ApplicationLogo className="h-8 w-8 transition-transform group-hover:scale-105" />
                        <div>
                            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                SaaS Starter
                            </span>
                            <span className="block text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                Workspace
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Team Switcher */}
                {currentTeam && (
                    <div className="px-3.5 py-3 border-b border-slate-200/80 dark:border-slate-800">
                        <div className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Current Team
                        </div>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className="group flex w-full items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 p-2 text-left text-xs font-medium text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                >
                                    <div className="flex items-center min-w-0 space-x-2">
                                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-sm">
                                            {currentTeam.name ? currentTeam.name.charAt(0).toUpperCase() : 'T'}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
                                                {currentTeam.name}
                                            </div>
                                            <div className="flex items-center space-x-1 text-[10px] capitalize text-slate-500 dark:text-slate-400">
                                                <span>{currentRole}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform" />
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content align="left" width="60" contentClasses="p-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                                                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium text-left transition ${
                                                    isSelected
                                                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                            >
                                                <span className="truncate">{team.name}</span>
                                                {isSelected && <Check className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 ml-2" />}
                                            </Dropdown.Link>
                                        );
                                    })}
                                </div>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                )}

                {/* Navigation Links */}
                <div className="px-3 py-3">
                    <div className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
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
                                        className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                                            item.active
                                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm border-l-4 border-indigo-600 dark:border-indigo-400'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                                        }`}
                                    >
                                        <Icon
                                            className={`mr-3 h-4 w-4 shrink-0 transition-colors ${
                                                item.active
                                                    ? 'text-indigo-600 dark:text-indigo-400'
                                                    : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                                            }`}
                                        />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                    </nav>
                </div>
            </div>

            {/* User Info & Visible Profile / Logout Footer */}
            <div className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
                <div className="flex items-center space-x-2.5 px-1 py-1">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-xs font-bold text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700">
                        {getInitials(user.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {user.name}
                        </p>
                        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 px-0.5">
                    <Link
                        href={route('profile.edit')}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                            route().current('profile.edit')
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold'
                                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                    >
                        <UserIcon className="h-3.5 w-3.5" />
                        <span>Profile</span>
                    </Link>
                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Log out</span>
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased transition-colors">
            {/* Desktop Left Sidebar (Fixed) */}
            <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:flex md:w-64 md:flex-col border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar Overlay Drawer */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Drawer Content */}
                    <div className="fixed inset-y-0 left-0 flex w-72 max-w-full flex-col bg-white dark:bg-slate-900 shadow-2xl">
                        <div className="absolute right-3 top-3 z-10">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(false)}
                                className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                {/* Fixed Sticky Header */}
                <header className="sticky top-0 z-30 border-b border-slate-200/80 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md transition-colors">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        <div className="flex min-h-16 items-center justify-between py-3 gap-4">
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(true)}
                                    className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shrink-0"
                                    aria-label="Open mobile navigation"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>
                                <div className="min-w-0 flex-1">
                                    {header}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 py-6">
                    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
