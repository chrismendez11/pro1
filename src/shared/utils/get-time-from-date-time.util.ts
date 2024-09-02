import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
export function getTimeFromDateTime(dateTime: Date): string {
  return dayjs.utc(dateTime).format('HH:mm');
}
