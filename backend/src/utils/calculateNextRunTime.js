import { Cron } from 'croner';

export function calculateNextRunTime(cronExpression, timezone = 'UTC') {
    const job = new Cron(cronExpression, { timezone });
    let nextRun = job.nextRun();

    const nowInUserTimezone = new Date(new Date().toLocaleString("en-CA", { timeZone: timezone }));

    // If nextRun is tomorrow but today's time hasn't passed in user's timezone, use today
    if (nextRun && nextRun.getDate() > nowInUserTimezone.getDate()) {
        const cronParts = cronExpression.split(' ');
        if (cronParts.length >= 2 && cronParts[0] !== '*' && cronParts[1] !== '*') {
            const scheduledMinute = parseInt(cronParts[0]);
            const scheduledHour = parseInt(cronParts[1]);

            const todayScheduled = new Date(nowInUserTimezone);
            todayScheduled.setHours(scheduledHour, scheduledMinute, 0, 0);

            if (todayScheduled > nowInUserTimezone) {
                nextRun = todayScheduled;
            }
        }
    }

    return nextRun;
}