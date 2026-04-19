import { DateTime } from 'luxon';

export function getCurrentTimeInTimezone(timezone) {
    const isoString = DateTime.now().toUTC().toISO(); // ✅ Forces UTC
    return DateTime.fromISO(isoString, { zone: timezone });
}




// export async function getCurrentTimeInTimezone(timezone) {
//     try {
//         const response = await fetch(`https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`);
        
//         if (!response.ok) {
//             throw new Error('Failed to fetch time from API');
//         }

//         const data = await response.json();
        
//         return DateTime.fromISO(data.dateTime, { zone: timezone });
//     } 
//     catch (error) {
//         console.error('Time API failed:', error.message);
//         return null;
//     }
// }