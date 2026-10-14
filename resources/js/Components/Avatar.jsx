export default function Avatar({ name = '', size = 'md', className = '' }) {
    const getInitials = (text) => {
        if (!text) return 'U';
        const parts = text.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    const colorClasses = [
        'bg-indigo-600 text-white',
        'bg-violet-600 text-white',
        'bg-blue-600 text-white',
        'bg-emerald-600 text-white',
        'bg-rose-600 text-white',
        'bg-amber-600 text-white',
        'bg-teal-600 text-white',
        'bg-fuchsia-600 text-white',
    ];

    const getColor = (text) => {
        if (!text) return colorClasses[0];
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            hash = text.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % colorClasses.length;
        return colorClasses[index];
    };

    const sizeClasses = {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-7 w-7 text-xs',
        md: 'h-8 w-8 text-xs',
        lg: 'h-10 w-10 text-sm',
        xl: 'h-12 w-12 text-base',
    }[size] || 'h-8 w-8 text-xs';

    const color = getColor(name);
    const initials = getInitials(name);

    return (
        <div
            className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold shadow-sm ring-1 ring-white/20 select-none ${color} ${sizeClasses} ${className}`}
            aria-label={name}
        >
            {initials}
        </div>
    );
}
