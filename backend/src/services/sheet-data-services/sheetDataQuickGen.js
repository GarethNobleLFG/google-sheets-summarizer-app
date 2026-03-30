import { generateGeneralSummary } from '../ai-summary-services/generateGeneralSummary.js';
import { extractSpreadsheetId } from '../../utils/urlHelper.js';
import * as sheetDataRepository from '../../repositories/sheetDataRepositories.js';

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

        return result;
    } 
    catch (error) {
        console.error(`Error generating summary for sheet ID ${sheetId}:`, error);
        return {
            success: false,
            error: error.message
        };
    }
}