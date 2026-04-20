import { Cron } from 'croner';
import { DateTime } from 'luxon';

export function calculateNextRunTime(cronExpression, timezone) {
    const nowInUserTimezone = DateTime.now();

    if (!nowInUserTimezone.isValid) {
        console.error("Failed to parse current time for next run calculation");
        return null;
    }

    const startOfToday = nowInUserTimezone.startOf('day').toJSDate();

    const job = new Cron(cronExpression, { timezone }); // This will account for DST, does proper math for utc time to be a certain time in given timezone
    let nextRun = job.nextRun(startOfToday);
    
    if (!nextRun) return null;

    let nextRunLuxon = DateTime.fromJSDate(nextRun); 

    if (nextRunLuxon <= nowInUserTimezone) {
        nextRun = job.nextRun(); // Causes calc to start for the next day period
        nextRunLuxon = DateTime.fromJSDate(nextRun);
    }

    return nextRunLuxon.toJSDate();
}
