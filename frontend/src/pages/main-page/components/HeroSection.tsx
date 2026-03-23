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
            <div className="w-full max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="inline-flex items-center px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-full text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-4">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 animate-pulse"></span>
                        Now Available
                    </div>

                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black leading-tight mb-4 whitespace-nowrap">
                        <span className="text-gray-900 dark:text-white">Smart </span>
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Sheet </span>
                        <span className="text-gray-900 dark:text-white">Summaries</span>
                    </h1>

                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                        Transform your Google Sheets into intelligent insights delivered automatically.
                        Stay informed without the manual effort.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Automated Analysis</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 font-medium">Scheduled Reports</span>
                        </div>
                    </div>
                    <Animation />
                </motion.div>
            </div>
        </motion.div>
    );
};