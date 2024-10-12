import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
/**
 * @description Formats a utc date to a string
 */
export function formatDate(date: Date, format = 'DD/MM/YYYY'): string {
  return dayjs.utc(date).tz('America/Guatemala').format(format);
}
