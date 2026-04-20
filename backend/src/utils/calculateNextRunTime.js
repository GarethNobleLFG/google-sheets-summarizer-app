import { Cron } from 'croner';
import { DateTime } from 'luxon';

export function calculateNextRunTime(cronExpression, timezone) {
    const nowInUserTimezone = DateTime.now();

    if (!nowInUserTimezone.isValid) {
        console.error("Failed to parse current time for next run calculation");
        return null;
    }

    const startOfToday = nowInUserTimezone.startOf('day').toJSDate();

    const job = new Cron(cronExpression, { timezone }); // This will account for DST, so calc will be aware of that hour shift
    let nextRun = job.nextRun(startOfToday);
    
    if (!nextRun) return null;

    let nextRunLuxon = DateTime.fromJSDate(nextRun); 

    if (nextRunLuxon <= nowInUserTimezone) {
        nextRun = job.nextRun(); // Causes calc to start for the next day period
        nextRunLuxon = DateTime.fromJSDate(nextRun);
    }

    return nextRunLuxon.toISO();
}


// .toISO() - Creates the string with the correct Eastern offset
// **** .toISO() is your workaround for Sequelize's automatic UTC conversion. ****