import dotenv from 'dotenv';
import OpenAI from 'openai';
import { sendMessage } from '../messagingService.js';
import { processSheetForAI } from '../google/googleSheetService.js';
import { create } from '../../repositories/sheetSummary.js';  

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateGeneralSummary( sheetDataInfo, sheetOptions ) {
    try {
        // Step 1: Process and get result from google sheet using the URL
        const sheetData = await processSheetForAI(sheetDataInfo.link, sheetOptions);

        if (!sheetData.success) {
            throw new Error(`Failed to process sheet: ${sheetData.error}`);
        }

        // Step 2: Create the analysis prompt for OpenAI to collect correct data from sheet
        const analysisPrompt = `
            RULES:
                - ${sheetDataInfo.pre_prompt}

            SHEET DATA:
                ${sheetData.csvContent}

            RESPONSE (Provide EXACTLY this structure):
                [Collect all relative information based on the RULES and discard non essential information. List findings as response.]
        `;

        // Step 3: Make OpenAI API call for analysis
        const analysisResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: sheetDataInfo.pre_prompt
                },
                {
                    role: "user",
                    content: analysisPrompt
                }
            ],
            max_tokens: 2500,
            temperature: 0.1
        });

        const analysisData = analysisResponse.choices[0].message.content?.trim() || '';

        // Step 4: Create general summary prompt
        const generalPrompt = `
            RULES:
                -  ${sheetDataInfo.post_prompt}

            SHEET DATA:
                ${analysisData}

            RESPONSE (Provide EXACTLY this structure):

            [Write a decently long and comprehensive summary on the sheet data based on the RULES section.]

            TEXT_VERSION_START
            [Plain text version - no formatting, just clean readable text]
            TEXT_VERSION_END

            HTML_VERSION_START
            [Same content but formatted as clean HTML for email]
            Use: <h3> for section headers, <strong> for emphasis, <ul><li> for lists, 
            <p> for paragraphs, and inline styles for colors (green for positive, red for negative amounts)
            HTML_VERSION_END
        `;

        // Step 5: Call OpenAI again and summarize the important data
        const summaryResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: sheetDataInfo.post_prompt
                },
                {
                    role: "user",
                    content: generalPrompt
                }
            ],
            max_tokens: 2500,
            temperature: 0.1
        });

        // Step 6: Parse the response to extract both message types
        const fullResponse = summaryResponse.choices[0].message.content;

        const textMatch = fullResponse.match(/TEXT_VERSION_START([\s\S]*?)TEXT_VERSION_END/);
        const htmlMatch = fullResponse.match(/HTML_VERSION_START([\s\S]*?)HTML_VERSION_END/);

        const textVersion = textMatch ? textMatch[1].trim() : fullResponse;
        const htmlVersion = htmlMatch ? htmlMatch[1].trim() : `<p>${fullResponse.replace(/\n/g, '</p><p>')}</p>`;

        // Step 7: Save to database
        try {
            const summaryData = {
                summary_type: 'DocuSums Summary',
                text_version: textVersion, 
                html_version: htmlVersion  
            };

            const savedSummary = await create(summaryData);
            console.log('Summary saved to database with ID:', savedSummary.id);
        }
        catch (dbError) {
            console.log('Failed to save to database in API call: ', dbError.message);
        }

        // Step 8: Send the message
        const response = {
            text: textVersion,
            html: htmlVersion,
            messageType: 'DocuSums Summary',
            success: true
        };

        await sendMessage(response, sheetDataInfo);

        return {
            success: true,
            text: textVersion,
            html: htmlVersion,
            messageType: 'DocuSums Summary'
        };

    } 
    catch (error) {
        console.error('Error in general summary generation:', error);
        return {
            success: false,
            error: error.message
        };
    }
}