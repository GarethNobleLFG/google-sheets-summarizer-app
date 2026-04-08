import { generateGeneralSummary } from '../ai-summary-services/generateGeneralSummary.js';
import { extractSpreadsheetId } from '../../utils/urlHelper.js';
import * as sheetDataRepository from '../../repositories/sheetDataRepositories.js';
import * as userRepository from '../../repositories/userRepositories.js';

export async function quickGenerateSummary(sheetId) {
    try {
        if (!sheetId) {
            throw new Error('Sheet ID is required');
        }

        const sheetData = await sheetDataRepository.findById(sheetId);

        if (!sheetData) {
            throw new Error(`Sheet data not found for ID: ${sheetId}`);
        }

        if (!sheetData.link || !sheetData.sheet_name) {
            throw new Error('Sheet data must contain link and sheet_name properties');
        }

        // Check if user is within their summary limit
        const user = await userRepository.findById(sheetData.user_id);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.sums_used < parseInt(process.env.SUMS_LIMIT)) {
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

            if (!result.success) {
                throw new Error(`General summary failed: ${result.error}`);
            }

            // Increment user's summary count
            await userRepository.updateById(user.id, {
                sums_used: user.sums_used + 1
            });

            return result;
        }
        else {
            throw new Error('Summary limit exceeded. You have reached your maximum number of summaries.');
        }
    }
    catch (error) {
        console.error(`Error generating summary for sheet ID ${sheetId}:`, error);
        return {
            success: false,
            error: error.message
        };
    }
}