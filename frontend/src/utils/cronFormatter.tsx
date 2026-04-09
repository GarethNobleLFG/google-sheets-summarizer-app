import cronstrue from 'cronstrue';

export const formatCronExpression = (cronExpression: string): string => {
  try {
    return cronstrue.toString(cronExpression, {
      verbose: true,
      dayOfWeekStartIndexZero: true,
      use24HourTimeFormat: true
    });
  }
  catch (error) {
    console.error('Error parsing cron expression:', error);
    return cronExpression;
  }
};

export const formatCronExpressionShort = (cronExpression: string): string => {
  try {
    return cronstrue.toString(cronExpression, {
      verbose: false,
      dayOfWeekStartIndexZero: true,
      use24HourTimeFormat: true
    });
  }
  catch (error) {
    console.error('Error parsing cron expression:', error);
    return cronExpression;
  }
};

export const parseCronExpression = (cronExpression: string): {
  scheduleType: 'minutes' | 'daily' | 'weekday' | 'monthly' | 'yearly';
  values: {
    minutes: number;
    hour: number;
    minute: number;
    day: number;
    month: number;
    weekday: number;
  };
} | null => {
  if (!cronExpression) return null;

  try {
    // Validate the cron expression with cronstrue
    cronstrue.toString(cronExpression);

    const parts = cronExpression.split(' ');
    if (parts.length !== 5) return null;

    const [minute, hour, day, month /*, dayOfWeek*/] = parts;

    // Every X minutes: */X * * * *
    if (minute.startsWith('*/') && hour === '*' && day === '*' && month === '*') {
      const minutes = parseInt(minute.replace('*/', ''));
      return {
        scheduleType: 'minutes',
        values: { minutes, hour: 9, minute: 0, day: 1, month: 1, weekday: 1 }
      };
    }

    // Yearly: minute hour day month *
    if (day !== '*' && month !== '*') {
      return {
        scheduleType: 'yearly',
        values: {
          minutes: 15,
          minute: parseInt(minute),
          hour: parseInt(hour),
          day: parseInt(day),
          month: parseInt(month),
          weekday: 1
        }
      };
    }

    // Monthly: minute hour day * *
    if (day !== '*' && month === '*') {
      return {
        scheduleType: 'monthly',
        values: {
          minutes: 15,
          minute: parseInt(minute),
          hour: parseInt(hour),
          day: parseInt(day),
          month: 1,
          weekday: 1
        }
      };
    }

    // Daily: minute hour * * *
    if (day === '*' && month === '*') {
      return {
        scheduleType: 'daily',
        values: {
          minutes: 15,
          minute: parseInt(minute),
          hour: parseInt(hour),
          day: parseInt(day),
          month: 1,
          weekday: 1
        }
      };
    }

    // Weekly: minute hour * * weekday
    const [, , , , dayOfWeek] = parts;
    if (day === '*' && month === '*' && dayOfWeek !== '*') {
      return {
        scheduleType: 'weekday',
        values: {
          minutes: 15,
          minute: parseInt(minute),
          hour: parseInt(hour),
          day: 1,
          month: 1,
          weekday: parseInt(dayOfWeek)
        }
      };
    }

    return null;
  }
  catch (error) {
    console.error('Invalid cron expression:', error);
    return null;
  }
};