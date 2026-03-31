import * as userRepository from '../../repositories/userRepositories.js';
import * as sheetDataRepository from '../../repositories/sheetDataRepositories.js';
import { generateGeneralSummary } from '../ai-summary-services/generateGeneralSummary.js';
import { checkIfShouldExecute } from '../../utils/frequencyChecker.js';
import { extractSpreadsheetId } from '../../utils/urlHelper.js';
import parser from 'cron-parser';

// Main polling function.
export async function pollUsersForScheduledSummaries() {
    try {
        // Get all users.
        const users = await userRepository.findAll(1000);

        if (!users || users.length === 0) {
            console.log('No users found for polling');
            return { processed: 0, executed: 0, errors: [] };
        }

        // Process ALL users - PARALLEL VERSION.
        const userPromises = users.map(async (user) => {
            try {
                // Get all sheet data for this user using CRUD service.
                const userSheetData = await sheetDataRepository.findAllFromUser(user.id, 100);

                if (!userSheetData || userSheetData.length === 0) {
                    console.log(`No sheet data found for user ${user.id}`);
                    return { userId: user.id, processed: 1, executed: 0, errors: [] };
                }

                console.log(`Processing ${userSheetData.length} sheets for user ${user.id} in parallel.`);

                // Process each sheet for this user - PARALLEL VERSION.
                const sheetPromises = userSheetData.map(async (sheetData) => {
                    try {
                        const shouldExecute = checkIfShouldExecute(sheetData);

                        if (!shouldExecute) {
                            return { skipped: true, sheetId: sheetData.id };
                        }

                        // Validate URL before processing
                        const spreadsheetId = extractSpreadsheetId(sheetData.link);

                        if (!spreadsheetId || spreadsheetId === sheetData.link) {
                            throw new Error(`Invalid Google Sheets URL: ${sheetData.link}`);
                        }

                        const sheetOptions = {
                            range: `${sheetData.sheet_name}!A:Z`,
                            filterEmptyRows: true,
                            maxPreviewRows: 100
                        };

                        const result = await generateGeneralSummary(sheetData, sheetOptions);

                        // Calculate next run time from cron schedule
                        const interval = parser.parseExpression(sheetData.cron_schedule);
                        const nextRun = interval.next().toDate();

                        // Update both created_at and next_run_at
                        await sheetDataRepository.updateById(sheetData.id, {
                            created_at: new Date(),
                            next_run_at: nextRun
                        });

                        if (!result.success) {
                            throw new Error(`General summary failed: ${result.error}`);
                        }

                        return { success: true, sheetId: sheetData.id };

                    }
                    catch (error) {
                        return {
                            error: true,
                            sheetId: sheetData.id,
                            message: error.message,
                            sheetUrl: sheetData.link
                        };
                    }
                });

                // Wait for all sheets to complete being processed.
                const sheetResults = await Promise.allSettled(sheetPromises);

                // Process results for this user
                let userExecuted = 0;
                const userErrors = [];

                sheetResults.forEach((result) => {
                    if (result.status === 'fulfilled') {
                        if (result.value.success) {
                            userExecuted++;
                        }
                        else if (result.value.error) {
                            userErrors.push({
                                userId: user.id,
                                sheetId: result.value.sheetId,
                                sheetUrl: result.value.sheetUrl,
                                error: result.value.message
                            });
                        }
                    }
                });

                return {
                    userId: user.id,
                    processed: 1,
                    executed: userExecuted,
                    errors: userErrors
                };

            }
            catch (error) {
                console.error(`Error processing user ${user.id}:`, error);
                return {
                    userId: user.id,
                    processed: 1,
                    executed: 0,
                    errors: [{
                        userId: user.id,
                        error: error.message
                    }]
                };
            }
        });

        // Wait for ALL users to complete
        const userResults = await Promise.allSettled(userPromises);

        // Aggregate results from all users.
        let totalProcessed = 0;
        let totalExecuted = 0;
        const allErrors = [];

        userResults.forEach((result) => {
            if (result.status === 'fulfilled') {
                totalProcessed += result.value.processed;
                totalExecuted += result.value.executed;
                allErrors.push(...result.value.errors);
            }
        });

        console.log(`All users completed. Total processed: ${totalProcessed}, executed: ${totalExecuted}, errors: ${allErrors.length}`);

        return {
            processed: totalProcessed,
            executed: totalExecuted,
            errors: allErrors
        };

    }
    catch (error) {
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
        const userSheetData = await sheetDataRepository.findAllFromUser(parseInt(userId), 100);

        let executed = 0;
        const errors = [];

        for (const sheetData of userSheetData) {
            try {
                // Fix for triggerUserSummaries function - replace lines 175-195:
                const shouldExecute = checkIfShouldExecute(sheetData);

                if (shouldExecute) {
                    const sheetOptions = {
                        range: `${sheetData.sheet_name}!A:Z`,
                        filterEmptyRows: true,
                        maxPreviewRows: 100
                    };

                    const result = await generateGeneralSummary(sheetData, sheetOptions);

                    // Calculate next run time from cron schedule
                    const interval = parser.parseExpression(sheetData.cron_schedule);
                    const nextRun = interval.next().toDate();

                    // Update both created_at and next_run_at
                    await sheetDataRepository.updateById(sheetData.id, {
                        created_at: new Date(),
                        next_run_at: nextRun
                    });

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