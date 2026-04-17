import { DateTime } from 'luxon';

export function checkIfShouldExecute(sheetData, userTimezone = 'UTC') {
    if (sheetData.frequency && sheetData.frequency.toLowerCase() === 'none') {
        return false;
    }
    
    if (sheetData.next_run_at) {
        let nextRunTime;
        
        if (typeof sheetData.next_run_at === 'string') {
            nextRunTime = DateTime.fromFormat(sheetData.next_run_at, 'yyyy-MM-dd HH:mm:ss', { zone: userTimezone });
        } 
        else {
            const timeString = DateTime.fromJSDate(sheetData.next_run_at).toFormat('yyyy-MM-dd HH:mm:ss');
            nextRunTime = DateTime.fromFormat(timeString, 'yyyy-MM-dd HH:mm:ss', { zone: userTimezone });
        }
        
        const now = DateTime.now().setZone(userTimezone);
        return now >= nextRunTime;
    }
    
    return false;
}