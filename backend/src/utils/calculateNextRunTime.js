import { Cron } from 'croner';
import { DateTime } from 'luxon';

export function calculateNextRunTime(cronExpression, timezone) {
    const job = new Cron(cronExpression, { timezone });
    let nextRun = job.nextRun();
    
    if (!nextRun) {
        return null;
    }

    let nextRunLuxon = DateTime.fromJSDate(nextRun).setZone(timezone);
    const nowInUserTimezone = DateTime.now().setZone(timezone);
    
    if (!nowInUserTimezone.isValid) {
        console.log("Failed to parse current time for next run calculation");
        return null;
    }

    // If nextRun is for a future date but today's time hasn't reached the scheduled time yet, use today
    if (nextRunLuxon.startOf('day') > nowInUserTimezone.startOf('day')) {
        const cronParts = cronExpression.split(' ');
        if (cronParts.length >= 2 && cronParts[0] !== '*' && cronParts[1] !== '*') {
            const scheduledMinute = parseInt(cronParts[0]);
            const scheduledHour = parseInt(cronParts[1]);

            const todayScheduled = nowInUserTimezone.set({
                hour: scheduledHour,
                minute: scheduledMinute,
                second: 0,
                millisecond: 0
            });

            if (todayScheduled > nowInUserTimezone) {
                nextRunLuxon = todayScheduled;
            }
        }
    }

    return nextRunLuxon.toFormat('yyyy-MM-dd HH:mm:ss');
}