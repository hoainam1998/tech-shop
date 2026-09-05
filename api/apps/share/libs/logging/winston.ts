import winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { formatCurrentDateTime } from '@share/utils';

const ignoreTestEnv = winston.format((info) => {
  if (process.env.NODE_ENV === 'test') {
    return false;
  }
  return info;
});

winston.addColors({
  timestamp: 'green', // Available: black, red, green, yellow, blue, magenta, cyan, white, gray
  context: 'yellow',
});

const colorRender = winston.format.colorize();

const format = winston.format.combine(
  ignoreTestEnv(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json(),
);

export const mainLog = WinstonModule.createLogger({
  exitOnError: false,
  transports: [
    // 1. Colorized console transport for local development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.ms(),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, context, ms }: any): string => {
          const timestampStr = colorRender.colorize('timestamp', timestamp as string);
          const contextStr = colorRender.colorize('context', context as string);
          return `[Nest] ${timestampStr} ${level}: [${contextStr}] ${message} ${ms}`;
        }),
      ),
    }),
    // 2. Structured JSON file logging for production
    new winston.transports.File({
      filename: 'log/error.log',
      level: 'error',
      format,
    }),
  ],
});

export const consoleLog = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, context }: any): string => {
      const timestampStr = colorRender.colorize('timestamp', timestamp as string);
      const contextStr = colorRender.colorize('context', context as string);
      return `[Console] ${timestampStr} ${level}: [${contextStr}] ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export const recoverLog = (name: string): winston.Logger => {
  const fileName = `${name}_${formatCurrentDateTime()}`;
  return winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: `log/recover/${fileName}.log`,
        level: 'info',
        format,
      }),
    ],
  });
};

export const requestLog = (id: string): winston.Logger => {
  const fileName = `${id}_${formatCurrentDateTime()}`;
  return winston.createLogger({
    transports: [
      new winston.transports.File({
        filename: `log/request/${fileName}.log`,
        level: 'info',
        format,
      }),
    ],
  });
};
