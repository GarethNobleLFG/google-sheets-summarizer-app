import { Cron } from 'croner';
import { DateTime } from 'luxon';

export function calculateNextRunTime(cronExpression, timezone) {
    const nowInUserTimezone = DateTime.now().setZone(timezone);

    if (!nowInUserTimezone.isValid) {
        console.error("Failed to parse current time for next run calculation");
        return null;
    }

    // 1. Get the start of today in the user's zone
    const startOfToday = nowInUserTimezone.startOf('day').toJSDate();

    // 2. Initialize Croner
    const job = new Cron(cronExpression, { timezone });
    let nextRun = job.nextRun(startOfToday);
    
    if (!nextRun) return null;

    let nextRunLuxon = DateTime.fromJSDate(nextRun).setZone(timezone);

    if (nextRunLuxon <= nowInUserTimezone) {
        nextRun = job.nextRun(); // Causes calc to start for the next day period
        nextRunLuxon = DateTime.fromJSDate(nextRun).setZone(timezone);
    }

    return nextRunLuxon.toFormat('yyyy-MM-dd HH:mm:ss');
}