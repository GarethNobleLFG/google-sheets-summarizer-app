import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;
const CRON_SECRET = process.env.CRON_SECRET;

async function triggerScheduledSummaries() {
    try {
        console.log(`[${new Date().toISOString()}] Triggering scheduled summaries...`);
        
        const response = await axios.post(
            `${API_BASE_URL}/sheet-data/poll/scheduled-summaries`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CRON_SECRET}`,
                },
                timeout: 300000 // 5 minute timeout
            }
        );

        console.log(`Processed: ${response.data.data.processed}, Executed: ${response.data.data.executed}, Errors: ${response.data.data.errors.length}`);
        
    } 
    catch (error) {
        console.error(`[${new Date().toISOString()}] Error triggering summaries:`, {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        
        // Exit with error code so Render knows it failed
        process.exit(1);
    }
}

triggerScheduledSummaries();