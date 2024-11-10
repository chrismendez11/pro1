import { WinstonModuleOptions } from 'nest-winston';
import { ConsoleTransport } from './transports/console.transport';
import { CloudwatchTransport } from './transports/cloudwatch.transport';

export const winstonLogger: WinstonModuleOptions = {
  transports: [ConsoleTransport, CloudwatchTransport],
};
