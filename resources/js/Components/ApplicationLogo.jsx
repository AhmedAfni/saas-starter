export default function ApplicationLogo(props) {
    return (
        <svg
            {...props}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <rect width="40" height="40" rx="10" fill="url(#brand-gradient)" />
            <path
                d="M12 28L20 12L28 28H23L20 21L17 28H12Z"
                fill="white"
                fillOpacity="0.95"
            />
            <path
                d="M16 23H24"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
            />
            <circle cx="20" cy="14" r="2" fill="white" />
            <defs>
                <linearGradient
                    id="brand-gradient"
                    x1="0"
                    y1="0"
                    x2="40"
                    y2="40"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#6366F1" />
                </linearGradient>
            </defs>
        </svg>
    );
}
