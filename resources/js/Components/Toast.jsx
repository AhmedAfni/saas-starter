import { Transition } from '@headlessui/react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Toast() {
    const { flash = {} } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(null);
    const [isError, setIsError] = useState(false);

    const message = flash?.status || flash?.success || flash?.error;

    useEffect(() => {
        if (message) {
            setCurrentMessage(message);
            setIsError(Boolean(flash?.error));
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [message, flash]);

    if (!currentMessage) return null;

    return (
        <aside
            aria-live="polite"
            aria-atomic="true"
            className="fixed bottom-5 right-5 z-50 flex max-w-sm flex-col gap-2 pointer-events-none"
        >
            <Transition
                show={visible}
                enter="transition ease-out duration-300 transform"
                enterFrom="opacity-0 translate-y-3 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-200 transform"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-2 scale-95"
            >
                <div
                    className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md ${
                        isError
                            ? 'border-red-200 bg-red-50/95 text-red-900 dark:border-red-900/60 dark:bg-red-950/90 dark:text-red-200'
                            : 'border-slate-200/90 bg-white/95 text-slate-900 dark:border-slate-800 dark:bg-slate-900/95 dark:text-white ring-1 ring-black/5 dark:ring-white/10'
                    }`}
                >
                    {isError ? (
                        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                    ) : (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    )}

                    <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                        {currentMessage}
                    </div>

                    <button
                        type="button"
                        onClick={() => setVisible(false)}
                        className="inline-flex rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                        aria-label="Dismiss toast"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </Transition>
        </aside>
    );
}
