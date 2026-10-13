/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { eventSourcePrisma } from '@share/test/pre-setup/mock/prisma';
import AsyncLogging from '@share/libs/logging/async-logging/async-logger';
import { message, funcName, payload, user, context, file } from './logging-data';

const addJob = jest.fn();
const mailingService: any = {
  addJob,
};
const asyncLogging: any = new AsyncLogging(eventSourcePrisma as any, mailingService, context, file, user);

jest.mock('@share/libs/logging/console-logging.ts', () => {
  return function () {
    return { error: jest.fn() };
  };
});

export { message, funcName, payload, user, context, file, addJob, asyncLogging, eventSourcePrisma, mailingService };
