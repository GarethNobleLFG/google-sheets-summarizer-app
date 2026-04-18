import { DateTime } from 'luxon';

export function checkIfShouldExecute(sheetData, userTimezone = 'UTC') {
    if (sheetData.frequency && sheetData.frequency.toLowerCase() === 'none') {
        return false;
    }
    
    if (sheetData.next_run_at) {
        let nextRunTime;
        
        if (typeof sheetData.next_run_at === 'string') {
            nextRunTime = DateTime.fromSQL(sheetData.next_run_at, { zone: userTimezone });
        } 
        else {
            nextRunTime = DateTime
                .fromJSDate(sheetData.next_run_at)
                .setZone(userTimezone);
        }

        if (!nextRunTime.isValid) {
            console.log("Invalid DateTime:", nextRunTime.invalidExplanation);
            return false;
        }
        
        const now = DateTime.now().setZone(userTimezone);

        return now.toMillis() >= nextRunTime.toMillis();
    }
    
    return false;
}