import { useState } from 'react';
import { motion } from 'framer-motion';
import { createSheetData, updateSheetData } from '../../../hooks/sheetDataHooks';
import { getToken, decodeToken } from '../../../utils/tokenAuth';
import { PromptInfoModal } from './promptQueModal';
import { ScheduleSelector } from './ScheduleSelector';

export const SignupForm = ({
    formData,
    setFormData,
    showNotification,
    addNewSheet,
    triggerRefresh
}: {
    formData: {
        sheetUrl: string;
        sheetName: string;
        frequency: string;
        prePrompt: string;
        postPrompt: string;
        isEdit: boolean;
        id?: string | number;
        scheduleType?: 'minutes' | 'daily' | 'weekday' | 'monthly' | 'yearly' | 'none';
        scheduleValues?: {
            minutes: number;
            hour: number;
            minute: number;
            day: number;
            month: number;
            weekday: number;
            none: string;
        };
    };
    setFormData: (data: {
        sheetUrl: string;
        sheetName: string;
        frequency: string;
        prePrompt: string;
        postPrompt: string;
        isEdit: boolean;
        id?: string | number;
        scheduleType?: 'minutes' | 'daily' | 'weekday' | 'monthly' | 'yearly' | 'none';
        scheduleValues?: {
            minutes: number;
            hour: number;
            minute: number;
            day: number;
            month: number;
            weekday: number;
            none: string;
        };
    }) => void;
    showNotification: (message: string, type: 'success' | 'error') => void;
    addNewSheet: (newSheet: {
        id: number;
        sheet_name: string;
        link: string;
        frequency: string;
        pre_prompt: string;
        post_prompt: string;
        created_at: string;
    }) => void;
    triggerRefresh: () => void;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPromptInfo, setShowPromptInfo] = useState(false);

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
                        frequency: formData.frequency,
                        prePrompt: formData.prePrompt,
                        postPrompt: formData.postPrompt
                    },
                    token
                );

                showNotification('Sheet data updated successfully! Refresh page to see reflected edits!', 'success');
                triggerRefresh();
            }
            else {
                // Create new sheet data
                const newSheet = await createSheetData(
                    userData.id,
                    formData.sheetUrl,
                    formData.sheetName,
                    formData.frequency,
                    formData.prePrompt,
                    formData.postPrompt,
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
                prePrompt: '',
                postPrompt: '',
                isEdit: false,
                id: undefined,
                scheduleType: undefined,
                scheduleValues: undefined
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
            className="flex-1 flex items-center justify-center pt-6 sm:pt-10 px-4 sm:px-6 md:px-0 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm border-l border-gray-200/50 dark:border-gray-700/50"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
        >
            <div className="w-full max-w-md sm:max-w-lg mb-6 sm:mb-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="text-center mb-5 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            Get Started
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                            Setup your automated summaries
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Sheet Link */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-lg p-3 border border-white/50 dark:border-gray-700/50 shadow-lg"
                        >
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                📊 Google Sheet URL (**ensure Google Sheet has shareable link)
                            </label>
                            <input
                                type="url"
                                placeholder="https://docs.google.com/spreadsheets/d/..."
                                value={formData.sheetUrl}
                                onChange={(e) => setFormData({ ...formData, sheetUrl: e.target.value })}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                            />
                        </motion.div>

                        {/* Sheet Name */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.7 }}
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-lg p-3 border border-white/50 dark:border-gray-700/50 shadow-lg"
                        >
                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                📝 Sheet Tab Name (**must be name of sheet tab, not name of Google Sheet file)
                            </label>
                            <input
                                type="text"
                                placeholder="My Budget"
                                value={formData.sheetName}
                                onChange={(e) => setFormData({ ...formData, sheetName: e.target.value })}
                                maxLength={50}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all"
                            />
                        </motion.div>

                        {/* Pre-Prompt */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.8 }}
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-lg p-3 border border-white/50 dark:border-gray-700/50 shadow-lg"
                        >
                            <label className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                <span>💬 Pre-Processing Prompt *</span>
                                <button
                                    type="button"
                                    onClick={() => setShowPromptInfo(true)}
                                    className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-xs font-bold flex items-center justify-center"
                                    title="Learn about prompts"
                                >
                                    ?
                                </button>
                            </label>
                            <textarea
                                placeholder="You are a financial advisor...."
                                value={formData.prePrompt}
                                onChange={(e) => setFormData({ ...formData, prePrompt: e.target.value })}
                                required
                                rows={2}
                                maxLength={500}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all resize-none"
                            />
                        </motion.div>

                        {/* Post-Prompt */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.85 }}
                            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-lg p-3 border border-white/50 dark:border-gray-700/50 shadow-lg"
                        >
                            <label className="flex items-center justify-between text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                <span>✨ Post-Processing Prompt *</span>
                                <button
                                    type="button"
                                    onClick={() => setShowPromptInfo(true)}
                                    className="w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-xs font-bold flex items-center justify-center"
                                    title="Learn about prompts"
                                >
                                    ?
                                </button>
                            </label>
                            <textarea
                                placeholder="Specific instructions..."
                                value={formData.postPrompt}
                                onChange={(e) => setFormData({ ...formData, postPrompt: e.target.value })}
                                required
                                rows={2}
                                maxLength={500}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white placeholder-gray-500 transition-all resize-none"
                            />
                        </motion.div>

                        {/* Frequency */}
                        <ScheduleSelector
                            key={formData.isEdit ? formData.id : 'new'}
                            formData={formData}
                            setFormData={setFormData}
                        />

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 hover:from-indigo-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold py-3 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

                        {/* Cancel Edit Button - Only show when editing */}
                        {formData.isEdit && (
                            <motion.button
                                type="button"
                                onClick={() => {
                                    // Reset form data
                                    setFormData({
                                        sheetUrl: '',
                                        sheetName: '',
                                        frequency: '',
                                        prePrompt: '',
                                        postPrompt: '',
                                        isEdit: false,
                                        id: undefined,
                                        scheduleType: undefined,
                                        scheduleValues: undefined
                                    });
                                }}
                                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm flex items-center justify-center gap-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.1, delay: 0.4 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                ✖️ Cancel Edit
                            </motion.button>
                        )}
                    </form>
                </motion.div>
            </div>

            {/* Prompt Info Modal */}
            <PromptInfoModal
                isOpen={showPromptInfo}
                setIsOpen={setShowPromptInfo}
            />

        </motion.div>
    );
};