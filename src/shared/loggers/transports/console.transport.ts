import { getCurrentDateTime } from 'src/shared/utils/get-current-date-time.util';
import * as winston from 'winston';

export const ConsoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.json(),
    winston.format.timestamp({
      format() {
        return getCurrentDateTime({ utc: true, format: 'YYYY-MM-DD HH:mm:ss' });
      },
    }),
    winston.format.printf(
      ({ timestamp, level, message, method, url, stack }) => {
        const colorizeText = (text: string | unknown, color: string) =>
          `\x1b[${color}m${text}\x1b[0m`;
        return `${colorizeText('[Winston]', '32')} ${timestamp} ${colorizeText(`[${level.toUpperCase()}]`, '31')} ${colorizeText(`${method} ${url}`, '32')} ${colorizeText(message, '33')} \n${stack}`;
      },
    ),
  ),
});
