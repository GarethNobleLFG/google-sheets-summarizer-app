import { motion, AnimatePresence } from 'framer-motion';

export const PromptInfoModal = ({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}) => {
    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeModal}
                >
                    <motion.div
                        className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                                Prompt Guide
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                Customize how AI analyzes your data
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Pre-Prompt Explanation */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <span className="text-xl mr-2">💬</span>
                                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                                        Pre-Processing Prompt
                                    </h3>
                                </div>
                                <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                                    <strong>Sets the context</strong> - Tell the AI what role to play and what to look for in your data.
                                </p>
                                <div className="bg-blue-100 dark:bg-blue-800/30 rounded p-2">
                                    <p className="text-xs text-blue-700 dark:text-blue-300 italic">
                                        Example: "You are a financial advisor analyzing expense data. Look for spending patterns, unusual transactions, and budget categories."
                                    </p>
                                </div>
                            </div>

                            {/* Post-Prompt Explanation */}
                            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <span className="text-xl mr-2">✨</span>
                                    <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                                        Post-Processing Prompt
                                    </h3>
                                </div>
                                <p className="text-sm text-purple-800 dark:text-purple-200 mb-2">
                                    <strong>Defines the output</strong> - Specify exactly what you want the AI to do with the analyzed data.
                                </p>
                                <div className="bg-purple-100 dark:bg-purple-800/30 rounded p-2">
                                    <p className="text-xs text-purple-700 dark:text-purple-300 italic">
                                        Example: "Create a summary with top 3 spending categories, highlight any concerning trends, and provide 2 actionable recommendations."
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                💡 Tip: Be specific in both prompts for better AI analysis results
                            </p>
                        </div>

                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors text-xl font-bold"
                        >
                            ×
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};