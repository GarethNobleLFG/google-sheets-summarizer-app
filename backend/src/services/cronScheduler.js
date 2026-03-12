import cron from 'node-cron';
import { pollUsersForScheduledSummaries } from './summary-services/sheetDataServices.js';

let cronJob = null;

// Schedule the polling to run every 5 mins.
export function startScheduler() {
    cronJob = cron.schedule('*/5 * * * *', async () => {
        try {
            console.log(`Starting polling cycle at ${new Date().toISOString()}`);
            const result = await pollUsersForScheduledSummaries();
        } 
        catch (error) {
            console.error('Polling cycle failed:', error);
        }
    });   
}

// Stop scheduler (for graceful shutdown)
export function stopScheduler() {
    if (cronJob) {
        cronJob.stop();
        console.log('Cron scheduler stopped');
    }
}