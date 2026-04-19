import { DateTime } from 'luxon';
import { getCurrentTimeInTimezone } from './timeUtil.js';

export async function checkIfShouldExecute(sheetData, userTimezone) {
    if (sheetData.frequency && sheetData.frequency.toLowerCase() === 'none') {
        return false;
    }

    if (sheetData.next_run_at) {
        let nextRunTime;

        if (typeof sheetData.next_run_at === 'string') {
            nextRunTime = DateTime.fromSQL(sheetData.next_run_at, { zone: userTimezone });
        }
        else {
            nextRunTime = DateTime.fromJSDate(sheetData.next_run_at, { zone: userTimezone });
        }

        if (!nextRunTime.isValid) {
            console.log("Invalid DateTime:", nextRunTime.invalidExplanation);
            return false;
        }

        // Get current time from API, return false if API fails
        const now = await getCurrentTimeInTimezone(userTimezone);
        if (now === null) {
            console.log("Failed to get current time from API, skipping execution check");
            return false;
        }

        if (nextRunTime.zoneName !== userTimezone) {
            console.log(`Error: nextRunTime timezone mismatch. Expected: ${userTimezone}, Got: ${nextRunTime.zoneName}`);
            return false;
        }
        else if (now.zoneName !== userTimezone) {
            console.log(`Error: now timezone mismatch. Expected: ${userTimezone}, Got: ${now.zoneName}`);
            return false;
        }

        return now.toMillis() >= nextRunTime.toMillis();
    }

    return false;
}