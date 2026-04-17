import { DateTime } from 'luxon';

export function checkIfShouldExecute(sheetData, userTimezone = 'UTC') {
    if (sheetData.frequency && sheetData.frequency.toLowerCase() === 'none') {
        return false;
    }
    
    if (sheetData.next_run_at) {
        const nextRunTime = DateTime.fromFormat(sheetData.next_run_at, 'yyyy-MM-dd HH:mm:ss', { zone: userTimezone });
        // ↑ Luxon correctly interprets this as being in the USER's timezone with the flag at the end 
        const now = DateTime.now().setZone(userTimezone);
        
        return now >= nextRunTime;
    }
    
    return false;
}