import { motion } from 'framer-motion';

export const Notification = ({ message, type, visible, onClose }: {
    message: string;
    type: 'success' | 'error';
    visible: boolean;
    onClose: () => void;
}) => {
    if (!visible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-20 inset-x-0 mx-auto z-50 px-6 py-4 rounded-lg shadow-lg backdrop-blur-xl border ${type === 'success'
                    ? 'bg-green-50/90 dark:bg-green-900/90 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700'
                    : 'bg-red-50/90 dark:bg-red-900/90 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700'
                } max-w-md w-fit`}
        >
            <div className="flex items-center gap-3">
                {type === 'success' ? (
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                )}
                <span className="font-medium text-sm">{message}</span>
                <button
                    onClick={onClose}
                    className="ml-auto hover:opacity-70 transition-opacity"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </motion.div>
    );
};