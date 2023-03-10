import {LoggingWinston} from '@google-cloud/logging-winston';
import winston from 'winston';
import {NODE_ENV} from '../constants';
import NodeEnvironment from '../types/node-environment';

const loggingWinston = new LoggingWinston({
  labels: {},
});

const loggingConsole = new winston.transports.Console({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple(),
  ),
});

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    NODE_ENV === NodeEnvironment.DEVELOPMENT ? loggingConsole : loggingWinston,
  ],
});

export default logger;
