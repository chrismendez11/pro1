import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);
export function getCurrentDateTime(
  timezone = 'America/Guatemala',
  format = 'DD/MM/YYYY HH:mm:ss',
): string {
  return dayjs().tz(timezone).format(format);
}
