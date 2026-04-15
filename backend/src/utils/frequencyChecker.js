export function checkIfShouldExecute(sheetData) {
    if (sheetData.frequency && sheetData.frequency.toLowerCase() === 'none') {
        return false;
    }
    
    const now = new Date();
    
    if (sheetData.next_run_at) {
        const nextRunTime = new Date(sheetData.next_run_at);
        return now >= nextRunTime;
    }
    
    return false;
}