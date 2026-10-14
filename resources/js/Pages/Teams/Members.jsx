import Avatar from '@/Components/Avatar';
import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Users,
    UserPlus,
    Mail,
    Copy,
    Check,
    Clock,
    Shield,
    Trash2,
    CheckCircle2,
    AlertCircle,
} from 'lucide-react';

export default function Members({ team, members, invitations = [], permissions, availableRoles }) {
    const { flash = {}, errors: pageErrors = {} } = usePage().props;
    const [copiedToken, setCopiedToken] = useState(null);

    const {
        data: inviteData,
        setData: setInviteData,
        post: postInvite,
        processing: inviteProcessing,
        errors: inviteErrors,
        reset: resetInvite,
    } = useForm({
        email: '',
        role: 'member',
    });

    const submitInvite = (e) => {
        e.preventDefault();
        postInvite(route('teams.invitations.store', team.id), {
            onSuccess: () => resetInvite(),
        });
    };

    const handleRoleChange = (memberId, newRole) => {
        router.patch(
            route('teams.members.update', [team.id, memberId]),
            { role: newRole },
            { preserveScroll: true }
        );
    };

    const handleRemoveMember = (member) => {
        if (confirm(`Are you sure you want to remove ${member.name} from ${team.name}?`)) {
            router.delete(
                route('teams.members.destroy', [team.id, member.id]),
                { preserveScroll: true }
            );
        }
    };

    const handleCancelInvitation = (invitationId) => {
        if (confirm('Cancel this pending invitation?')) {
            router.delete(
                route('teams.invitations.destroy', [team.id, invitationId]),
                { preserveScroll: true }
            );
        }
    };

    const copyInviteUrl = (url, id) => {
        navigator.clipboard.writeText(url);
        setCopiedToken(id);
        setTimeout(() => setCopiedToken(null), 2000);
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const renderRoleBadge = (member) => {
        if (member.is_owner) {
            return (
                <span className="inline-flex items-center rounded-full bg-purple-50 dark:bg-purple-950/50 px-2.5 py-0.5 text-xs font-semibold text-purple-700 dark:text-purple-300 ring-1 ring-inset ring-purple-600/20 dark:ring-purple-500/30">
                    Owner
                </span>
            );
        }
        if (member.role === 'admin') {
            return (
                <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 ring-1 ring-inset ring-indigo-600/20 dark:ring-indigo-500/30">
                    Admin
                </span>
            );
        }
        return (
            <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:text-slate-300 ring-1 ring-inset ring-slate-600/10 dark:ring-slate-700">
                Member
            </span>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <div className="flex items-center space-x-2">
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                                Team Members
                            </h2>
                            <span className="text-slate-400 dark:text-slate-600 font-normal">&bull;</span>
                            <span className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">{team.name}</span>
                        </div>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Manage workspace collaborators, permission levels, and invitation links.
                        </p>
                    </div>

                    <div className="inline-flex items-center rounded-xl bg-indigo-50/80 dark:bg-indigo-950/60 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-900/50">
                        <Users className="mr-1.5 h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>{members.length} Active Member{members.length === 1 ? '' : 's'}</span>
                    </div>
                </div>
            }
        >
            <Head title={`Team Members - ${team.name}`} />

            <div className="space-y-6">
                {/* Flash message */}
                {flash?.status && (
                    <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3.5 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center space-x-3 text-emerald-800 dark:text-emerald-200">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <p className="text-xs sm:text-sm font-medium">{flash.status}</p>
                    </div>
                )}

                {/* Team Members List Card */}
                <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">Current Members</h3>
                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                Collaborators with authorized access to {team.name}.
                            </p>
                        </div>
                        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                            {members.length} total
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-3.5 space-y-2 sm:space-y-0 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                            >
                                <div className="flex items-center space-x-3">
                                    <Avatar name={member.name} size="md" />
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                {member.name}
                                            </span>
                                            {renderRoleBadge(member)}
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{member.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2.5 sm:ml-4">
                                    {member.is_owner ? (
                                        <span className="text-xs text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-800">
                                            Owner (immutable)
                                        </span>
                                    ) : permissions.can_manage_members ? (
                                        <div className="flex items-center space-x-2">
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                                className="rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 pl-2.5 pr-8 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            >
                                                {availableRoles.map((role) => (
                                                    <option key={role} value={role}>
                                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMember(member)}
                                                className="inline-flex items-center rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/30 px-2.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60 transition"
                                            >
                                                <Trash2 className="mr-1 h-3.5 w-3.5 text-red-500" />
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 dark:text-slate-500 capitalize">
                                            {member.role}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invite Member Card */}
                {permissions.can_invite && (
                    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5">
                        <div className="border-b border-slate-100 dark:border-slate-800 pb-3.5">
                            <div className="flex items-center space-x-2.5">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                                    <UserPlus className="h-4 w-4" />
                                </div>
                                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                    Invite New Member
                                </h3>
                            </div>
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Send an invitation link to invite someone to collaborate on {team.name}.
                            </p>
                        </div>

                        <form onSubmit={submitInvite} className="mt-5 max-w-xl space-y-4">
                            <div>
                                <InputLabel htmlFor="invite-email" value="Email Address" />
                                <div className="relative mt-1">
                                    <TextInput
                                        id="invite-email"
                                        type="email"
                                        name="email"
                                        value={inviteData.email}
                                        onChange={(e) => setInviteData('email', e.target.value)}
                                        className="block w-full pl-3 text-sm rounded-lg"
                                        placeholder="colleague@example.com"
                                        required
                                    />
                                </div>
                                <InputError message={inviteErrors.email || pageErrors.email} className="mt-1.5" />
                            </div>

                            <div>
                                <InputLabel htmlFor="invite-role" value="Role & Permissions" />
                                <select
                                    id="invite-role"
                                    value={inviteData.role}
                                    onChange={(e) => setInviteData('role', e.target.value)}
                                    className="mt-1 block w-full rounded-lg border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                >
                                    {availableRoles.map((role) => (
                                        <option key={role} value={role}>
                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={inviteErrors.role} className="mt-1.5" />
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    Admins can invite teammates and manage resources. Members can participate in workspace projects.
                                </p>
                            </div>

                            <div className="pt-1">
                                <PrimaryButton disabled={inviteProcessing} className="px-4 py-2 text-xs">
                                    {inviteProcessing ? 'Sending Invitation...' : 'Send Invitation'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                )}

                {/* Pending Invitations Card */}
                {permissions.can_invite && (
                    <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                                    Pending Invitations
                                </h3>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    Invitations that have not yet been accepted by their recipients.
                                </p>
                            </div>
                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                                {invitations.length} pending
                            </span>
                        </div>

                        {invitations.length === 0 ? (
                            <div className="px-5 py-8 text-center">
                                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-2.5">
                                    <Clock className="h-5 w-5" />
                                </div>
                                <h4 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                                    No pending invitations
                                </h4>
                                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    All sent invitations have been accepted or expired.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                {invitations.map((invitation) => (
                                    <div
                                        key={invitation.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-5 py-3.5 space-y-2 sm:space-y-0 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                                                        {invitation.email}
                                                    </span>
                                                    <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 ring-1 ring-inset ring-amber-600/20 dark:ring-amber-500/30">
                                                        {invitation.role}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                                    Expires {new Date(invitation.expires_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => copyInviteUrl(invitation.accept_url, invitation.id)}
                                                className="inline-flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                                            >
                                                {copiedToken === invitation.id ? (
                                                    <>
                                                        <Check className="mr-1 h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="mr-1 h-3.5 w-3.5 text-slate-400 dark:text-slate-400" />
                                                        <span>Copy Link</span>
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleCancelInvitation(invitation.id)}
                                                className="inline-flex items-center rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50/40 dark:bg-red-950/30 px-2.5 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/60 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
