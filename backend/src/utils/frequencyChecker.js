// Check if summary should be executed based on frequency
export function checkIfShouldExecute(sheetData) {
    const now = new Date();
    
    // If we have a next_run_at time, check if it's time to run
    if (sheetData.next_run_at) {
        const nextRunTime = new Date(sheetData.next_run_at);
        return now >= nextRunTime;
    }
    
    // Default: don't execute if we can't determine schedule
    return false;
}