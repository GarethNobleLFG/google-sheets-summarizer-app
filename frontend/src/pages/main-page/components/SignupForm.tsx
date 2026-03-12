import { motion } from 'framer-motion';

export const SignupForm = () => {
    return (
        <motion.div
            className="flex-1 flex items-start justify-center p-6 lg:p-12 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border-l border-gray-200/50 dark:border-gray-700/50"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="w-full max-w-sm mt-12">
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/50 dark:border-gray-700/50"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="text-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                            Get Started Today
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Setup your first automated summary
                        </p>
                    </div>

                    <form className="space-y-4">
                        {/* Sheet Link */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                📊 Google Sheet URL
                            </label>
                            <input
                                type="url"
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                            />
                        </motion.div>

                        {/* Sheet Name */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                        >
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                📝 Sheet Name
                            </label>
                            <input
                                type="text"
                                placeholder="My Budget"
                                className="w-full px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                            />
                        </motion.div>

                        {/* Frequency */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.9 }}
                        >
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                ⏰ Summary Frequency
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                                    <label key={freq} className={`
                                        flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer transition-all
                                        ${freq === 'Weekly'
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300'
                                        }
                                    `}>
                                        <input
                                            type="radio"
                                            name="frequency"
                                            value={freq.toLowerCase()}
                                            defaultChecked={freq === 'Weekly'}
                                            className="sr-only"
                                        />
                                        <div className="text-lg mb-0.5">
                                            {freq === 'Daily' ? '🌅' : freq === 'Weekly' ? '📅' : '📊'}
                                        </div>
                                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                                            {freq}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.0 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Start Receiving Summaries
                        </motion.button>

                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                            Free for 30 days. No credit card required.
                        </p>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};