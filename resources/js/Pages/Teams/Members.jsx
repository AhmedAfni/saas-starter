import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function Members({ team, members, invitations, permissions, availableRoles }) {
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

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold leading-tight text-gray-800">
                            Team Members &bull; {team.name}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Manage team members, roles, and invitation access.
                        </p>
                    </div>
                </div>
            }
        >
            <Head title={`Team Members - ${team.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {flash?.status && (
                        <div className="rounded-md bg-green-50 p-4 border border-green-200">
                            <p className="text-sm font-medium text-green-800">{flash.status}</p>
                        </div>
                    )}

                    {/* Team Members List */}
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-lg font-medium text-gray-900">Current Members</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                People who have access to collaborate on projects in this team.
                            </p>
                        </div>

                        <div className="mt-6 divide-y divide-gray-100">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 space-y-2 sm:space-y-0"
                                >
                                    <div>
                                        <div className="flex items-center space-x-3">
                                            <span className="font-medium text-gray-900">{member.name}</span>
                                            {member.is_owner ? (
                                                <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-800">
                                                    Owner
                                                </span>
                                            ) : member.role === 'admin' ? (
                                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                                                    Admin
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-800">
                                                    Member
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500">{member.email}</p>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        {member.is_owner ? (
                                            <span className="text-xs text-gray-400 italic">
                                                Team owner (cannot be removed or demoted)
                                            </span>
                                        ) : permissions.can_manage_members ? (
                                            <>
                                                <select
                                                    value={member.role}
                                                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                                    className="rounded-md border-gray-300 py-1.5 text-xs shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                >
                                                    {availableRoles.map((role) => (
                                                        <option key={role} value={role}>
                                                            {role.charAt(0).toUpperCase() + role.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>

                                                <DangerButton
                                                    onClick={() => handleRemoveMember(member)}
                                                    className="text-xs px-2.5 py-1.5"
                                                >
                                                    Remove
                                                </DangerButton>
                                            </>
                                        ) : (
                                            <span className="text-xs text-gray-400 capitalize">
                                                {member.role}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invite Member Form */}
                    {permissions.can_invite && (
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-medium text-gray-900">Invite New Member</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Send an invitation email to add a new collaborator to {team.name}.
                                </p>
                            </div>

                            <form onSubmit={submitInvite} className="mt-6 max-w-xl space-y-4">
                                <div>
                                    <InputLabel htmlFor="invite-email" value="Email Address" />
                                    <TextInput
                                        id="invite-email"
                                        type="email"
                                        name="email"
                                        value={inviteData.email}
                                        onChange={(e) => setInviteData('email', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="colleague@example.com"
                                        required
                                    />
                                    <InputError message={inviteErrors.email || pageErrors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="invite-role" value="Role" />
                                    <select
                                        id="invite-role"
                                        value={inviteData.role}
                                        onChange={(e) => setInviteData('role', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        {availableRoles.map((role) => (
                                            <option key={role} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={inviteErrors.role} className="mt-2" />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Admins can manage projects and invite teammates. Members can create and view projects.
                                    </p>
                                </div>

                                <div>
                                    <PrimaryButton disabled={inviteProcessing}>
                                        {inviteProcessing ? 'Sending...' : 'Send Invitation'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Pending Invitations */}
                    {permissions.can_invite && invitations.length > 0 && (
                        <div className="bg-white p-6 shadow sm:rounded-lg">
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="text-lg font-medium text-gray-900">Pending Invitations</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    These invitations expire in 7 days and can only be accepted once by the invited email address.
                                </p>
                            </div>

                            <div className="mt-6 divide-y divide-gray-100">
                                {invitations.map((invitation) => (
                                    <div
                                        key={invitation.id}
                                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 space-y-2 sm:space-y-0"
                                    >
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="font-medium text-gray-900">{invitation.email}</span>
                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 uppercase">
                                                    {invitation.role}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <SecondaryButton
                                                type="button"
                                                onClick={() => copyInviteUrl(invitation.accept_url, invitation.id)}
                                                className="text-xs px-2.5 py-1.5"
                                            >
                                                {copiedToken === invitation.id ? 'Copied Link!' : 'Copy Link'}
                                            </SecondaryButton>

                                            <DangerButton
                                                type="button"
                                                onClick={() => handleCancelInvitation(invitation.id)}
                                                className="text-xs px-2.5 py-1.5"
                                            >
                                                Cancel
                                            </DangerButton>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
