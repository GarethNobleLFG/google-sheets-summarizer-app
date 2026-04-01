import cronstrue from 'cronstrue';

export const formatCronExpression = (cronExpression: string): string => {
  try {
    return cronstrue.toString(cronExpression, { 
      verbose: true,
      dayOfWeekStartIndexZero: false,
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
      dayOfWeekStartIndexZero: false,
      use24HourTimeFormat: true 
    });
  } 
  catch (error) {
    console.error('Error parsing cron expression:', error);
    return cronExpression;
  }
};