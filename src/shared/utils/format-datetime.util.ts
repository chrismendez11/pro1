import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
/**
 * @description Formats a utc datetime to a string
 * @param {Date} date - The date to format
 * @param {string} timezone - The timezone to use
 * @param {string} format - The format to use
 */
export function formatDatetime(
  date: Date,
  timezone: string,
  format: string = 'DD/MM/YYYY HH:mm',
): string {
  return dayjs(date).tz(timezone).format(format);
}
