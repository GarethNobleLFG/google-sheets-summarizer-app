import { generateGeneralSummary } from '../ai-summary-services/generateGeneralSummary.js';
import { extractSpreadsheetId } from '../../utils/urlHelper.js';
import * as sheetDataCrudServices from './sheetDataCrudServices.js';

export async function quickGenerateSummary(sheetId) {
    try {
        // Validate sheet ID
        if (!sheetId) {
            throw new Error('Sheet ID is required');
        }

        // Fetch the sheet data from database
        const sheetData = await sheetDataCrudServices.getSheetDataById(sheetId);

        if (!sheetData) {
            throw new Error(`Sheet data not found for ID: ${sheetId}`);
        }

        // Validate required fields from the fetched data
        if (!sheetData.link || !sheetData.sheet_name) {
            throw new Error('Sheet data must contain link and sheet_name properties');
        }

        // Validate URL before processing
        const spreadsheetId = extractSpreadsheetId(sheetData.link);

        if (!spreadsheetId || spreadsheetId === sheetData.link) {
            throw new Error(`Invalid Google Sheets URL: ${sheetData.link}`);
        }

        // Create sheet options for the API call
        const sheetOptions = {
            range: `${sheetData.sheet_name}!A:Z`,
            filterEmptyRows: true,
            maxPreviewRows: 100
        };

        // Generate the summary
        const result = await generateGeneralSummary(sheetData.link, sheetOptions, sheetData.pre_prompt, sheetData.post_prompt);

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