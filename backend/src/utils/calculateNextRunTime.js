import { Cron } from 'croner';

export function calculateNextRunTime(cronExpression) {
    const now = new Date();
    const job = new Cron(cronExpression);
    let nextRun = job.nextRun();

    // If nextRun is tomorrow but today's time hasn't passed, use today
    if (nextRun && nextRun.getDate() > now.getDate()) {
        const cronParts = cronExpression.split(' ');
        if (cronParts.length >= 2 && cronParts[0] !== '*' && cronParts[1] !== '*') {
            const scheduledMinute = parseInt(cronParts[0]);
            const scheduledHour = parseInt(cronParts[1]);

            const todayScheduled = new Date(now);
            todayScheduled.setHours(scheduledHour, scheduledMinute, 0, 0);

            if (todayScheduled > now) {
                nextRun = todayScheduled;
            }
        }
    }

    return nextRun;
}