import { CloudWatchLogs } from '@aws-sdk/client-cloudwatch-logs';
import WinstonCloudwatch from 'winston-cloudwatch';

const client = new CloudWatchLogs({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const CloudwatchTransport = new WinstonCloudwatch({
  cloudWatchLogs: client,
  logGroupName: `/pro1/${process.env.NODE_ENV}`,
  logStreamName: process.env.SERVER_NAME,
  messageFormatter: ({ level, message, method, url, stack }) => {
    return `${level} ${message} ${method} ${url} ${stack}`;
  },
});
