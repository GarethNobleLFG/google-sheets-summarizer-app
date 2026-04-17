import { DateTime } from 'luxon';

export function checkIfShouldExecute(sheetData, userTimezone = 'UTC') {
    if (sheetData.frequency && sheetData.frequency.toLowerCase() === 'none') {
        return false;
    }
    
    if (sheetData.next_run_at) {
        const nextRunTime = DateTime.fromJSDate(sheetData.next_run_at).setZone(userTimezone);
        const now = DateTime.now().setZone(userTimezone);
        return now >= nextRunTime;
    }
    
    return false;
}