import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
/**
 * @description Formats a date to a string
 * @param {Date} date - The date to format
 * @param {string} format - The format to use
 */
export function formatDate(date: Date, format: string = 'DD/MM/YYYY'): string {
  return dayjs.utc(date).format(format);
}
