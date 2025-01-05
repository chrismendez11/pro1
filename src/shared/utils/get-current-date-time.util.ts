import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);
export function getCurrentDateTime({
  utc = false,
  timezone = 'America/Guatemala',
  format = 'DD/MM/YYYY HH:mm:ss',
}): string {
  return utc
    ? dayjs().utc().format(format)
    : dayjs().tz(timezone).format(format);
}
