import * as winston from 'winston';
import { getCurrentDateTime } from '../utils/get-current-date-time.util';

export const winstonLogger = {
  level: 'error',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp({
          format() {
            return getCurrentDateTime();
          },
        }),
        winston.format.printf(
          ({ timestamp, level, message, method, url, stack }) => {
            const colorizeText = (text: string, color: string) =>
              `\x1b[${color}m${text}\x1b[0m`;
            return `${colorizeText('[Winston Logger]', '32')} ${timestamp} ${colorizeText(`[${level.toUpperCase()}]`, '31')} ${colorizeText(`${method} ${url}`, '32')} ${colorizeText(message, '33')} \n${stack}`;
          },
        ),
      ),
    }),
  ],
};
