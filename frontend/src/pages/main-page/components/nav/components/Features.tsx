import { motion, AnimatePresence } from 'framer-motion';

export const Features = ({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}) => {
    const closeModal = () => {
        setIsOpen(false);
    };

    const steps = [
        {
            number: "01",
            title: "Set Up Your Sheet.",
            description: "Fill out the form with your Google Sheet info.",
            warning: "⚠️ Make sure your sheet gives access to 'Anyone with the link'.",
            icon: "📊"
        },
        {
            number: "02", 
            title: "Choose Your Schedule.",
            description: "Select a schedule for automatic summaries, or use manual mode and select 'None' to rely on the manual summarize button.",
            icon: "⏰"
        },
        {
            number: "03",
            title: "Get AI Summaries.",
            description: "Receive AI-driven summaries delivered straight to your email.",
            icon: "🤖"
        }
    ];

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
                        className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
                                How It Works
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                Get started with automated spreadsheet summaries in 3 simple steps
                            </p>
                        </div>

                        {/* Steps */}
                        <div className="space-y-6">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                            {step.number}
                                        </div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="text-2xl">{step.icon}</span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {step.title}
                                            </h3>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-300 mb-2">
                                            {step.description}
                                        </p>
                                        {step.warning && (
                                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-3">
                                                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                                    {step.warning}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-8 text-center">
                            <button
                                onClick={closeModal}
                                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
                            >
                                Got It, Let's Start!
                            </button>
                        </div>

                        {/* Close button */}
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