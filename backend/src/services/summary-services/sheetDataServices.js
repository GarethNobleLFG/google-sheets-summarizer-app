import * as userRepository from '../../repositories/userRepositories.js';
import * as sheetDataCrudServices from './sheetDataCrudServices.js';
import { generateGeneralSummary } from '../generateGeneralSummary.js';

// Check if summary should be executed based on frequency
function checkIfShouldExecute(frequency, createdAt) {
    const now = new Date();
    const created = new Date(createdAt);
    const timeDiff = now - created;

    // Convert frequency string to execution logic
    const freq = frequency.toLowerCase().trim();

    // Daily frequencies
    if (freq === 'daily') {
        // Execute if it's been at least 23 hours (to handle timing variations)
        return timeDiff >= (23 * 60 * 60 * 1000);
    }

    // Weekly frequencies
    if (freq === 'weekly') {
        // Execute if it's been at least 6.5 days
        return timeDiff >= (6.5 * 24 * 60 * 60 * 1000);
    }

    // Monthly frequencies
    if (freq === 'monthly') {
        // Execute if it's been at least 28 days
        return timeDiff >= (28 * 24 * 60 * 60 * 1000);
    }

    // Default: don't execute if we can't parse the frequency
    console.warn(`Unknown frequency format: ${frequency}`);
    return false;
}

// Execute the appropriate summary generation
async function executeSummaryGeneration(sheetData) {
    try {
        const { link, sheet_name } = sheetData;

        const sheetOptions = {
            range: `${sheet_name}!A:Z`,
            filterEmptyRows: true,
            maxPreviewRows: 100
        };

        // Generate general summary for all frequencies
        const result = await generateGeneralSummary(link, sheetOptions);

        if (!result.success) {
            throw new Error(`General summary failed: ${result.error}`);
        }

    }
    catch (error) {
        throw error;
    }
}

// Process individual user's sheet data
async function processUserSheetData(userId) {
    try {
        // Get all sheet data for this user using CRUD service
        const userSheetData = await sheetDataCrudServices.getAllSheetDataFromUser(userId, 100);

        let executed = 0;
        const errors = [];

        for (const sheetData of userSheetData) {
            try {
                const shouldExecute = checkIfShouldExecute(sheetData.frequency, sheetData.created_at);

                if (shouldExecute) {
                    await executeSummaryGeneration(sheetData);
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
        throw new Error(`Failed to process user ${userId}: ${error.message}`);
    }
}

// Main polling function
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
                const userResult = await processUserSheetData(user.id);
                totalProcessed++;
                totalExecuted += userResult.executed;

                if (userResult.errors.length > 0) {
                    errors.push(...userResult.errors.map(err => ({
                        userId: user.id,
                        email: user.email,
                        error: err
                    })));
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

// Manual trigger for specific user
export async function triggerUserSummaries(userId) {
    try {
        if (!userId || isNaN(userId)) {
            throw new Error('Valid user ID is required');
        }

        const result = await processUserSheetData(parseInt(userId));
        return result;

    } 
    catch (error) {
        throw error;
    }
}