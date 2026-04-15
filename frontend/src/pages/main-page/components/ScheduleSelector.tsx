import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const ScheduleSelector = ({ formData, setFormData }: {
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
            weekday: number;
            month: number;
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
}) => {
    const [scheduleType, setScheduleType] = useState<'minutes' | 'daily' | 'weekday' | 'monthly' | 'yearly' | 'none'>(() => {
        // If the form is in editing, initlaize based on the schedule type thats already there.
        if (formData.isEdit && formData.scheduleType) {
            return formData.scheduleType;
        }
        return 'daily';
    });

    const [values, setValues] = useState(() => {
        // If the form is in editing, initlaize based on the values thats already there.
        if (formData.isEdit && formData.scheduleValues) {
            return formData.scheduleValues;
        }
        return {
            minutes: 15,
            hour: 9,
            minute: 0,
            day: 1,
            month: 1,
            weekday: 1,
            none: ''
        };
    });

    const generateCronExpression = (
        scheduleType: 'minutes' | 'daily' | 'weekday' | 'monthly' | 'yearly' | 'none',
        values: {
            minutes?: number;
            hour?: number;
            minute?: number;
            day?: number;
            weekday?: number;
            month?: number;
            none?: string;
        }
    ): string => {
        switch (scheduleType) {
            case 'minutes':
                // Every X minutes: */X * * * *
                return `*/${values.minutes || 15} * * * *`;
            case 'daily':
                // Every day at specific time: minute hour * * *
                return `${values.minute || 0} ${values.hour || 9} * * *`;
            case 'weekday':
                // Every week on specific day at specific time: minute hour * * weekday
                return `${values.minute || 0} ${values.hour || 9} * * ${values.weekday || 1}`;
            case 'monthly':
                // Every X day of month at specific time: minute hour day * *
                return `${values.minute || 0} ${values.hour || 9} ${values.day || 1} * *`;
            case 'yearly':
                // Every year on specific date and time: minute hour day month *
                return `${values.minute || 0} ${values.hour || 9} ${values.day || 1} ${values.month || 1} *`;
            case 'none':
                return 'none';
            default:
                return '0 9 * * *';
        }
    };

    useEffect(() => {
        if (!formData.frequency || formData.frequency === 'weekday' || formData.frequency === 'daily') {
            const initialCron = generateCronExpression(scheduleType, values);
            setFormData({
                ...formData,
                frequency: initialCron,
                scheduleType: scheduleType,
                scheduleValues: values
            });
        }
    }, []);

    const handleValueChange = (key: keyof typeof values, value: number): void => {
        const updatedValues = { ...values, [key]: value };
        setValues(updatedValues);
        const newCron = generateCronExpression(scheduleType, updatedValues);
        setFormData({
            ...formData,
            frequency: newCron,
            scheduleType: scheduleType,
            scheduleValues: updatedValues
        });
    };

    const handleScheduleTypeChange = (newType: 'minutes' | 'daily' | 'weekday' | 'monthly' | 'yearly' | 'none'): void => {
        setScheduleType(newType);
        const newCron = generateCronExpression(newType, values);
        setFormData({
            ...formData,
            frequency: newCron,
            scheduleType: newType,
            scheduleValues: values
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-lg p-3 border border-white/50 dark:border-gray-700/50 shadow-lg"
        >
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                ⏰ Execution Schedule
            </label>

            {/* Schedule Type Selector */}
            <div className="mb-3">
                <select
                    value={scheduleType}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleScheduleTypeChange(e.target.value as 'minutes' | 'daily' | 'weekday' | 'monthly' | 'yearly' | 'none')
                    }
                    className="w-full px-2 py-1 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
                >
                    {/* <option value="minutes">Every x minutes</option> */}
                    <option value="daily">Every day at xx:xx</option>
                    <option value="weekday">Every week on [day] at xx:xx</option>
                    <option value="monthly">Every x of the month at xx:xx</option>
                    <option value="yearly">Every year on specific date</option>
                    <option value="none">No automatic schedule</option>
                </select>
            </div>

            {/* Dynamic inputs based on schedule type */}
            <div className="space-y-2">
                {scheduleType === 'minutes' && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-700 dark:text-gray-300">Every</span>
                        <input
                            type="number"
                            min="1"
                            max="59"
                            value={values.minutes}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('minutes', parseInt(e.target.value) || 15)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-700 dark:text-gray-300">minute(s)</span>
                    </div>
                )}

                {scheduleType === 'daily' && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-700 dark:text-gray-300">Every day at</span>
                        <input
                            type="number"
                            min="0"
                            max="23"
                            value={values.hour}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('hour', parseInt(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-700 dark:text-gray-300">:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={values.minute}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('minute', parseInt(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                    </div>
                )}

                {scheduleType === 'weekday' && (
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        <span className="text-gray-700 dark:text-gray-300">Every week on</span>
                        <select
                            value={values.weekday}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                handleValueChange('weekday', parseInt(e.target.value) || 1)
                            }
                            className="px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        >
                            <option value={0}>Sunday</option>
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                        </select>
                        <span className="text-gray-700 dark:text-gray-300">at</span>
                        <input
                            type="number"
                            min="0"
                            max="23"
                            value={values.hour}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('hour', parseInt(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-700 dark:text-gray-300">:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={values.minute}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('minute', parseInt(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                    </div>
                )}

                {scheduleType === 'monthly' && (
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        <span className="text-gray-700 dark:text-gray-300">Every</span>
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={values.day}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('day', parseInt(e.target.value) || 1)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-700 dark:text-gray-300">of the month at</span>
                        <input
                            type="number"
                            min="0"
                            max="23"
                            value={values.hour}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('hour', parseInt(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-700 dark:text-gray-300">:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={values.minute}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('minute', parseInt(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                    </div>
                )}

                {scheduleType === 'yearly' && (
                    <div className="flex items-center gap-2 text-sm flex-wrap">
                        <span className="text-gray-700 dark:text-gray-300">Every year on day</span>
                        <input
                            type="number"
                            min="1"
                            max="31"
                            value={values.day}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('day', parseInt(e.target.value) || 1)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-700 dark:text-gray-300">of month</span>
                        <input
                            type="number"
                            min="1"
                            max="12"
                            value={values.month}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('month', parseInt(e.target.value) || 1)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-700 dark:text-gray-300">at</span>
                        <input
                            type="number"
                            min="0"
                            max="23"
                            value={values.hour}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('hour', parseInt(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                        <span className="text-gray-700 dark:text-gray-300">:</span>
                        <input
                            type="number"
                            min="0"
                            max="59"
                            value={values.minute}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleValueChange('minute', parseInt(e.target.value) || 0)
                            }
                            className="w-16 px-2 py-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-center text-gray-900 dark:text-white"
                        />
                    </div>
                )}

                {scheduleType === 'none' && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                        Manual execution only - no automatic scheduling
                    </div>
                )}
            </div>
        </motion.div>
    );
};