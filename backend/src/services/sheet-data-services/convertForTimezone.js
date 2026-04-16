import * as userRepository from '../../repositories/userRepositories.js';
import * as sheetDataRepository from '../../repositories/sheetDataRepositories.js';

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
                const updateFields = {};
                
                if (sheetData.created_at) {
                    updateFields.created_at = new Date(new Date(sheetData.created_at).toLocaleString("en-CA", { timeZone: userTimezone }));
                }
                
                if (sheetData.next_run_at) {
                    updateFields.next_run_at = new Date(new Date(sheetData.next_run_at).toLocaleString("en-CA", { timeZone: userTimezone }));
                }

                if (Object.keys(updateFields).length > 0) {
                    await sheetDataRepository.updateById(sheetData.id, updateFields);
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