import { Cron } from 'croner';
import { DateTime } from 'luxon';

export function calculateNextRunTime(cronExpression, timezone = 'UTC') {
    const job = new Cron(cronExpression, { timezone });
    let nextRun = job.nextRun();

    const nowInUserTimezone = DateTime.now().setZone(timezone);

    // If nextRun is tomorrow but today's time hasn't passed in user's timezone, use today
    if (nextRun && nextRun.getDate() > nowInUserTimezone.day) {
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
                nextRun = todayScheduled.toJSDate();
            }
        }
    }

    // Convert final result to timezone-aware string format
    if (nextRun) {
        return DateTime.fromJSDate(nextRun).setZone(timezone).toFormat('yyyy-MM-dd HH:mm:ss');
    }
    
    return nextRun;
}