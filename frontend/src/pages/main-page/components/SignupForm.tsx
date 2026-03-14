import { useState } from 'react';
import { motion } from 'framer-motion';
import { createSheetData, updateSheetData } from '../../../hooks/sheetDataHooks';
import { getToken, decodeToken } from '../../../utils/tokenAuth';

export const SignupForm = ({
    formData,
    setFormData,
    showNotification,
    addNewSheet
}: {
    formData: { sheetUrl: string; sheetName: string; frequency: string; isEdit: boolean; id?: string | number };
    setFormData: (data: { sheetUrl: string; sheetName: string; frequency: string; isEdit: boolean; id?: string | number }) => void;
    showNotification: (message: string, type: 'success' | 'error') => void;
    addNewSheet: (newSheet: {
        id: number;
        sheet_name: string;
        link: string;
        frequency: string;
        created_at: string;
    }) => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = getToken();
            const userData = token ? decodeToken(token) : null;

            if (!userData || !token) {
                showNotification('Please log in or sign up to continue', 'error');
                console.error('User not authenticated');
                return;
            }

            if (formData.isEdit) {
                if (!formData.id) {
                    console.error('No sheet ID provided for update');
                    return;
                }

                await updateSheetData(
                    formData.id,
                    {
                        userId: userData.id,
                        link: formData.sheetUrl,
                        sheetName: formData.sheetName,
                        frequency: formData.frequency
                    },
                    token
                );

                showNotification('Sheet data updated successfully!', 'success');
            }
            else {
                // Create new sheet data
                const newSheet = await createSheetData(
                    userData.id,
                    formData.sheetUrl,
                    formData.sheetName,
                    formData.frequency,
                    token
                );

                addNewSheet(newSheet);

                showNotification('Sheet added successfully! Enjoy your summaries.', 'success');
            }

            // Reset form data
            setFormData({
                sheetUrl: '',
                sheetName: '',
                frequency: '',
                isEdit: false,
                id: undefined
            });

        }
        catch (error) {
            console.error('Error submitting form:', error);
            showNotification(
                error instanceof Error ? error.message : 'Something went wrong. Please try again.',
                'error'
            );
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border-l border-gray-200/50 dark:border-gray-700/50"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >

            <div className="w-full max-w-sm">
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

                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                                value={formData.sheetUrl}
                                onChange={(e) => setFormData({ ...formData, sheetUrl: e.target.value })}
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
                                value={formData.sheetName}
                                onChange={(e) => setFormData({ ...formData, sheetName: e.target.value })}
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
                                    <label key={freq} className={`flex flex-col items-center p-2 rounded-lg border-2 cursor-pointer transition-all
                                            ${formData.frequency === freq.toLowerCase()
                                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-300'
                                        }
                                    `}>
                                        <input
                                            type="radio"
                                            name="frequency"
                                            value={freq.toLowerCase()}
                                            checked={formData.frequency === freq.toLowerCase()}
                                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
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
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 1.0 }}
                            whileHover={!isLoading ? { scale: 1.02 } : {}}
                            whileTap={!isLoading ? { scale: 0.98 } : {}}
                        >
                            {isLoading && (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isLoading ? 'Processing...' : (formData.isEdit ? 'Update Summary Settings' : 'Start Receiving Summaries')}
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