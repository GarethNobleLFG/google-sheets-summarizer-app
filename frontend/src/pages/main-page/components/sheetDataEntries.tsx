import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { deleteSheetData, quickGenerateSummary } from '../../../hooks/sheetDataHooks';
import { getToken } from '../../../utils/tokenAuth';
import { Notification } from './Notification';
import { formatCronExpression, formatCronExpressionShort, parseCronExpression } from '../../../utils/cronFormatter';

export const SheetDataEntries = ({
    onEditSheet,
    sheetData,
    removeSheet
}: {
    onEditSheet: (sheet: {
        id: number;
        link: string;
        sheet_name: string;
        frequency: string;
        pre_prompt: string;
        post_prompt: string;
        scheduleType: 'minutes' | 'daily' | 'monthly' | 'yearly';
        scheduleValues: {
            minutes: number;
            hour: number;
            minute: number;
            day: number;
            month: number;
        };
    }) => void;
    sheetData: {
        id: number;
        sheet_name: string;
        link: string;
        frequency: string;
        pre_prompt: string;
        post_prompt: string;
        created_at: string;
    }[];
    removeSheet: (sheetId: number) => void;
}) => {
    const [loadingSheets, setLoadingSheets] = useState<Set<number>>(new Set());
    const [notification, setNotification] = useState({ message: '', type: 'success' as 'success' | 'error', visible: false });

    // Set document title.
    useEffect(() => {
        document.title = 'Start Summaries';
    }, []);

    const handleQuickSummary = async (sheetId: number) => {
        try {
            setLoadingSheets(prev => new Set(prev).add(sheetId));

            const token = getToken();
            if (token) {
                await quickGenerateSummary(sheetId, token);
                setNotification({ message: 'Summary generated successfully! Check your email.', type: 'success', visible: true });
                setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 3000);
            }
        }
        catch (err) {
            setNotification({ message: `Failed to generate summary: ${err}`, type: 'error', visible: true });
            setTimeout(() => setNotification(prev => ({ ...prev, visible: false })), 5000);
        }
        finally {
            setLoadingSheets(prev => {
                const newSet = new Set(prev);
                newSet.delete(sheetId);
                return newSet;
            });
        }
    };

    return (
        <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="w-full max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h1 className="text-3xl lg:text-4xl xl:text-5xl font-black leading-tight mb-4">
                        <span className="text-gray-900 dark:text-white">Sheet </span>
                        <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">Data </span>
                        <span className="text-gray-900 dark:text-white">Entries</span>
                    </h1>

                    <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                        Manage and monitor your Google Sheets summaries.
                        {sheetData.length === 0 ? 'Add your first sheet to get started.' : `You have ${sheetData.length} active sheet${sheetData.length !== 1 ? 's' : ''}.`}
                    </p>

                    {sheetData.length === 0 ? (
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50 dark:border-gray-700/50 text-center">
                            <div className="text-gray-500 dark:text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No sheets yet</h3>
                            <p className="text-gray-600 dark:text-gray-300">Start tracking!.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sheetData.map((sheet, index) => (
                                <motion.div
                                    key={sheet.id}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl p-6 border border-white/50 dark:border-gray-700/50 transition-all duration-300"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 * index }}
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <span
                                            className="truncate max-w-28 text-xs px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-medium"
                                            title={formatCronExpression(sheet.frequency)}
                                        >
                                            {formatCronExpressionShort(sheet.frequency)}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                        {sheet.sheet_name}
                                    </h3>

                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 truncate">
                                        {sheet.link}
                                    </p>

                                    {/* Pre-Prompt and Post-Prompt */}
                                    <div className="space-y-1 mb-4">
                                        {/* Pre-Prompt */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Pre:</span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
                                                {sheet.pre_prompt || "No pre-prompt set"}
                                            </p>
                                        </div>

                                        {/* Post-Prompt */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">Post:</span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
                                                {sheet.post_prompt || "No post-prompt set"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        <div className="mb-2">
                                            <span>Type: Google Sheet</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                className={`flex items-center gap-1 font-medium transition-all duration-200 ${loadingSheets.has(sheet.id)
                                                    ? 'text-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 bg-clip-text text-transparent'
                                                    }`}
                                                onClick={() => handleQuickSummary(sheet.id)}
                                                disabled={loadingSheets.has(sheet.id)}
                                            >
                                                {loadingSheets.has(sheet.id) ? (
                                                    <>
                                                        <svg className="w-3 h-3 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Loading...
                                                    </>
                                                ) : (
                                                    'Summarize'
                                                )}
                                            </button>
                                            <button
                                                className="text-indigo-500 hover:text-indigo-600 font-medium"
                                                onClick={() => {
                                                    const parsedCron = parseCronExpression(sheet.frequency);
                                                    onEditSheet({
                                                        id: sheet.id,
                                                        link: sheet.link,
                                                        sheet_name: sheet.sheet_name,
                                                        frequency: sheet.frequency,
                                                        pre_prompt: sheet.pre_prompt,
                                                        post_prompt: sheet.post_prompt,
                                                        scheduleType: parsedCron?.scheduleType || 'daily',
                                                        scheduleValues: parsedCron?.values || { minutes: 15, hour: 9, minute: 0, day: 1, month: 1 }
                                                    });
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-600 font-medium"
                                                onClick={async () => {
                                                    try {
                                                        const token = getToken();
                                                        if (token) {
                                                            await deleteSheetData(sheet.id, token);
                                                            removeSheet(sheet.id);
                                                        }
                                                    }
                                                    catch (err) {
                                                        console.error('Failed to delete sheet:', err);
                                                    }
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>

                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Notification for enrty interactions */}
            <Notification
                message={notification.message}
                type={notification.type}
                visible={notification.visible}
                onClose={() => setNotification(prev => ({ ...prev, visible: false }))}
            />

        </motion.div>
    );
};