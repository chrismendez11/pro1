import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
/**
 * @description Get time from a date time
 * @param {Date} dateTime
 */
export function getTimeFromDateTime(dateTime: Date): string {
  return dayjs.utc(dateTime).format('HH:mm');
}
