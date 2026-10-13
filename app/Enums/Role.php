<?php

namespace App\Enums;

enum Role: string
{
    case Owner = 'owner';
    case Admin = 'admin';
    case Member = 'member';

    /**
     * Get all role values.
     *
     * @return array<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get assignable roles for invitations and member management.
     *
     * @return array<string>
     */
    public static function assignableRoles(): array
    {
        return [
            self::Admin->value,
            self::Member->value,
        ];
    }
}
