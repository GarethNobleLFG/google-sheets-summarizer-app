import * as userRepository from '../../repositories/userRepositories.js';
import * as sheetDataRepository from '../../repositories/sheetDataRepositories.js';
import { DateTime } from 'luxon';

export async function convertForTimezone(userId) {
    try {
        if (!userId || isNaN(userId)) {
            throw new Error('Valid user ID is required');
        }

        const userTimezone = await userRepository.findTimezoneById(parseInt(userId));
        if (!userTimezone) {
            throw new Error('User not found');
        }

        const userSheetData = await sheetDataRepository.findAllFromUser(parseInt(userId), 1000);
        if (!userSheetData || userSheetData.length === 0) {
            return { message: 'No sheet data found for user', converted: 0 };
        }

        let converted = 0;
        const errors = [];

        for (const sheetData of userSheetData) {
            try {
                if (sheetData.created_at) {
                    let dbTime = DateTime.fromJSDate(sheetData.created_at).toUTC().toISO();

                    let conversion = DateTime.fromISO(dbTime, { zone: userTimezone });

                    const convertedCreatedAt = conversion.toFormat('yyyy-MM-dd HH:mm:ss');

                    await sheetDataRepository.updateById(sheetData.id, {
                        created_at: convertedCreatedAt
                    });

                    converted++;
                }
            }
            catch (error) {
                errors.push({ sheetId: sheetData.id, error: error.message });
            }
        }

        return {
            message: `Converted ${converted} sheet data entries for user ${userId}`,
            converted,
            errors
        };

    }
    catch (error) {
        throw new Error(`Failed to convert timestamps: ${error.message}`);
    }
}