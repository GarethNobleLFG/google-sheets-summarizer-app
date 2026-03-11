import cron from 'node-cron';
import { pollUsersForScheduledSummaries } from './summary-services/sheetDataServices.js';

let isPollingRunning = false;
let lastPollResult = null;
let lastPollTime = null;

// Schedule the polling to run every hour
export function startScheduler() {
    cron.schedule('*/5 * * * *', async () => {
        if (isPollingRunning) {
            console.log('Polling already running, skipping this cycle');
            return;
        }
        
        await runPollingCycle();
    });   
}

async function runPollingCycle() {
    isPollingRunning = true;
    lastPollTime = new Date();
    
    console.log(`Starting polling cycle at ${lastPollTime.toISOString()}`);
    
    try {
        const result = await pollUsersForScheduledSummaries();
        lastPollResult = {
            success: true,
            ...result,
            timestamp: lastPollTime
        };
        
        console.log(`Polling cycle completed successfully:`, {
            processed: result.processed,
            executed: result.executed,
            errors: result.errors.length
        });
        
        // Log errors if any
        if (result.errors.length > 0) {
            console.error('Polling errors:', result.errors);
        }
        
    } 
    catch (error) {
        console.error('Polling cycle failed:', error);
        lastPollResult = {
            success: false,
            error: error.message,
            timestamp: lastPollTime
        };
    } 
    finally {
        isPollingRunning = false;
    }
}

// Manual trigger (for testing or admin use)
export async function triggerManualPoll() {
    if (isPollingRunning) {
        throw new Error('Polling is already running');
    }
    
    await runPollingCycle();
    return lastPollResult;
}

// Stop scheduler (for graceful shutdown)
export function stopScheduler() {
    cron.getTasks().forEach(task => task.stop());
    console.log('Cron scheduler stopped');
}