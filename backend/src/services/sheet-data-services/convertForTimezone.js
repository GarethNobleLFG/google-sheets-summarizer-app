import SheetData from '../../models/sheetDataModel.js';
import { calculateNextRunTime } from '../../utils/calculateNextRunTime.js';

export async function convertUserTimezone(userId, newTimezone) {
    if (!userId || isNaN(userId)) {
        throw new Error('Valid user ID is required');
    }

    if (!newTimezone || typeof newTimezone !== 'string') {
        throw new Error('Valid timezone string is required');
    }

    try {
        // Get all sheet data for the user
        const userSheetData = await SheetData.findAll({
            where: {
                user_id: parseInt(userId)
            }
        });

        if (userSheetData.length === 0) {
            return { message: 'No sheet data found for user', updatedCount: 0 };
        }

        let updatedCount = 0;
        const updatePromises = [];

        for (const sheetData of userSheetData) {
            if (sheetData.frequency && sheetData.frequency.trim().toLowerCase() !== 'none') {
                try {
                    const newNextRunAt = calculateNextRunTime(sheetData.frequency.trim(), newTimezone);

                    const updatePromise = SheetData.update(
                        {
                            next_run_at: newNextRunAt,
                        },
                        { where: { id: sheetData.id } }
                    ).then(() => {
                        updatedCount++;
                    });

                    updatePromises.push(updatePromise);
                }
                catch (cronError) {
                    console.warn(`Skipping sheet data ID ${sheetData.id} due to invalid cron expression: ${cronError.message}`);
                }
            }
        }

        // Wait for all updates to complete and runs all calls
        await Promise.all(updatePromises);

        return {
            message: `Successfully converted ${updatedCount} sheet data entries to timezone: ${newTimezone}`,
            updatedCount: updatedCount,
            totalEntries: userSheetData.length
        };

    }
    catch (error) {
        throw new Error(`Failed to convert user timezone: ${error.message}`);
    }
}