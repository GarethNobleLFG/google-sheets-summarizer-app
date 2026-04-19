import { motion } from 'framer-motion';
import { Animation } from './Animation';

export const HeroSection = () => {
    return (
        <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="w-full max-w-3xl px-4 sm:px-0">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="inline-flex items-center px-2 py-1 sm:px-3 sm:py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-3 sm:mb-4">
                        <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-indigo-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
                        Now Available
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight mb-3 sm:mb-4 whitespace-nowrap">
                        <span className="text-gray-900 dark:text-white">AI Driven </span>
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Sheet </span>
                        <span className="text-gray-900 dark:text-white">Summaries</span>
                    </h1>

                    <p className="text-base sm:text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl">
                        Transform your Google Sheets into intelligent insights delivered automatically.
                        Stay informed without the manual effort.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-6 sm:mb-8">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">Prompt Based Responses</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">Scheduled Reports</span>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">Summaries Sent to Your Email!</span>
                        </div>
                    </div>
                    <Animation />
                </motion.div>
            </div>
        </motion.div>
    );
};