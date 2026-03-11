import * as userRepository from '../../repositories/userRepositories.js';
import * as sheetDataCrudServices from './sheetDataCrudServices.js';
import { generateGeneralSummary } from './ai-generations/generateGeneralSummary.js';
import { checkIfShouldExecute } from '../../utils/frequencyChecker.js';

// Main polling function.
export async function pollUsersForScheduledSummaries() {
    try {
        console.log('Starting scheduled summary polling...');

        // Get all users
        const users = await userRepository.findAll(1000); // High limit to get all users

        if (!users || users.length === 0) {
            console.log('No users found for polling');
            return { processed: 0, executed: 0, errors: [] };
        }

        console.log(`Found ${users.length} users to check`);

        let totalProcessed = 0;
        let totalExecuted = 0;
        const errors = [];

        // Process each user
        for (const user of users) {
            try {
                // Get all sheet data for this user using CRUD service
                const userSheetData = await sheetDataCrudServices.getAllSheetDataFromUser(user.id, 100);
                totalProcessed++;

                let userExecuted = 0;

                for (const sheetData of userSheetData) {
                    try {
                        const shouldExecute = checkIfShouldExecute(sheetData.frequency, sheetData.created_at);

                        if (shouldExecute) {

                            const sheetOptions = {
                                range: `${sheetData.sheet_name}!A:Z`,
                                filterEmptyRows: true,
                                maxPreviewRows: 100
                            };

                            // Generate general summary for all frequencies
                            const result = await generateGeneralSummary(sheetData.link, sheetOptions);

                            if (!result.success) {
                                throw new Error(`General summary failed: ${result.error}`);
                            }

                            userExecuted++;
                            totalExecuted++;
                            console.log(`Executed summary for user ${user.id}, sheet: ${sheetData.sheet_name}`);
                        }

                    } 
                    catch (error) {
                        console.error(`Error processing sheet ${sheetData.id} for user ${user.id}:`, error);
                        errors.push({
                            userId: user.id,
                            email: user.email,
                            error: `Sheet ${sheetData.sheet_name}: ${error.message}`
                        });
                    }
                }
            } 
            catch (error) {
                console.error(`Error processing user ${user.id}:`, error);
                errors.push({
                    userId: user.id,
                    email: user.email,
                    error: error.message
                });
            }
        }

        console.log(`Polling completed. Processed: ${totalProcessed}, Executed: ${totalExecuted}, Errors: ${errors.length}`);

        return {
            processed: totalProcessed,
            executed: totalExecuted,
            errors
        };

    } 
    catch (error) {
        console.error('Error in polling service:', error);
        throw error;
    }
}

// Manual trigger for specific user for testing.
export async function triggerUserSummaries(userId) {
    try {
        if (!userId || isNaN(userId)) {
            throw new Error('Valid user ID is required');
        }

        console.log(`Manually triggering summaries for user ${userId}`);

        // Get all sheet data for this user
        const userSheetData = await sheetDataCrudServices.getAllSheetDataFromUser(parseInt(userId), 100);
        
        let executed = 0;
        const errors = [];

        for (const sheetData of userSheetData) {
            try {
                const shouldExecute = checkIfShouldExecute(sheetData.frequency, sheetData.created_at);

                if (shouldExecute) {
                    const sheetOptions = {
                        range: `${sheetData.sheet_name}!A:Z`,
                        filterEmptyRows: true,
                        maxPreviewRows: 100
                    };

                    const result = await generateGeneralSummary(sheetData.link, sheetOptions);

                    if (!result.success) {
                        throw new Error(`General summary failed: ${result.error}`);
                    }

                    executed++;
                    console.log(`Executed summary for user ${userId}, sheet: ${sheetData.sheet_name}`);
                }

            } 
            catch (error) {
                console.error(`Error processing sheet ${sheetData.id} for user ${userId}:`, error);
                errors.push(`Sheet ${sheetData.sheet_name}: ${error.message}`);
            }
        }

        return { executed, errors };

    } 
    catch (error) {
        throw error;
    }
}