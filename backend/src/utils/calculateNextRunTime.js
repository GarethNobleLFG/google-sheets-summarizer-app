import { Cron } from 'croner';
import { DateTime } from 'luxon';
import { getCurrentTimeInTimezone } from './timeUtil.js';

export function calculateNextRunTime(cronExpression, timezone) {
    const job = new Cron(cronExpression, { timezone }); // ✅ Cron calculates in user timezone. Prevents againt offset time arithmetic.
    let nextRun = job.nextRun();

    let time = DateTime.fromJSDate(nextRun).toUTC().toISO(); // Force to UTC
    let nextRunLuxon = DateTime.fromISO(time, { zone: timezone }); // Interpret UTC in user timezone

    const nowInUserTimezone = getCurrentTimeInTimezone(timezone);
    if (!nowInUserTimezone.isValid) {
        console.log("Failed to parse current time for next run calculation");
        return null;
    }

    if (nextRunLuxon) {
        // If nextRun is tomorrow but today's time hasn't reached the scheduled time as if it were today, use today
        if (nextRunLuxon.day > nowInUserTimezone.day) {
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

                if (todayScheduled.toMillis() > nowInUserTimezone.toMillis()) {
                    nextRunLuxon = todayScheduled;
                }
            }
        }

        return nextRunLuxon.toFormat('yyyy-MM-dd HH:mm:ss');
    }

    return nextRun;
}