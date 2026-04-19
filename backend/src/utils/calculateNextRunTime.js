import { Cron } from 'croner';
import { DateTime } from 'luxon';

export function calculateNextRunTime(cronExpression, timezone) {
    const job = new Cron(cronExpression, { timezone });
    let nextRun = job.nextRun();

    const nowInUserTimezone = DateTime.now().setZone(timezone);

    if (nextRun) {
        let nextRunLuxon = DateTime.fromJSDate(nextRun).setZone(timezone);
        
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