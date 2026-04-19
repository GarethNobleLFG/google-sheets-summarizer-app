import { DateTime } from 'luxon';

export function checkIfShouldExecute(sheetData, userTimezone) {
    if (sheetData.frequency && sheetData.frequency.toLowerCase() === 'none') {
        return false;
    }

    if (sheetData.next_run_at) {
        let nextRunTime = DateTime.fromJSDate(sheetData.next_run_at).setZone(userTimezone);


        if (!nextRunTime.isValid) {
            console.log("Invalid DateTime:", nextRunTime.invalidExplanation);
            return false;
        }

        // Get current time, return false if parsing fails        
        const now = DateTime.now().setZone(userTimezone);

        return now >= nextRunTime;
    }

    return false;
}