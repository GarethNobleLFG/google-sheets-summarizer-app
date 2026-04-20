import { DateTime } from 'luxon';

export function checkIfShouldExecute(sheetData) {
    if (!sheetData.next_run_at || sheetData.frequency?.toLowerCase() === 'none') {
        return false;
    }

    let nextRunTime = DateTime.fromJSDate(sheetData.next_run_at);

    if (!nextRunTime.isValid) {
        return false;
    }

    const now = DateTime.now();

    return now >= nextRunTime;
}