import { HttpStatus } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaClient } from 'generated/prisma/tech-shop';
import { Prisma, LogType, log } from 'generated/prisma/event-source';
import { EVENT_NAME, REQUEST_HANDLING_STATUS, TENANT_NAME } from './enums';
import AlsService from './libs/als/als.service';

export type EventPatternType = { cmd: string };

export type PrismaClientReplica = PrismaClient & {
  $primary: () => Omit<PrismaClient, '$primary' | '$replica'>;
  $replica: () => Omit<PrismaClient, '$primary' | '$replica'>;
};

export type MicroserviceHeaderType = {
  tenant: string;
};

export interface IService {
  readonly [key: string]: any;
  readonly alsService: AlsService;
}

export type MessageResponseType = {
  message: string;
  errorCode?: string;
};

export type MessagesType = {
  messages: string[];
};

export type FileValidationOptions = {
  allowedMimeTypes: string[] | string | RegExp;
  maxSizeInBytes: number;
};

export type MulterFieldsType = {
  [key: string]: FileValidationOptions;
};

export type MultipleMulterFieldFiles = Record<string, Express.Multer.File[]>;

export type MicroservicesErrorResponse = {
  status: HttpStatus;
  response?: any;
  message?: string;
  code: string;
} & Error;

export type EventSourceJobData = {
  event: EVENT_NAME;
  params: string[];
};

export type LoggingPayloadType = Record<string, number | string>;

export type LoggingJobData = {
  message: string;
  func: string;
  type?: LogType;
  payload: LoggingPayloadType;
  file?: URL;
  context?: string;
};

export type AsyncLoggingJobData = Omit<LoggingJobData, 'payload'> & {
  payload: LoggingPayloadType | (number | string)[];
};

export type MailingJobData = Pick<Prisma.logCreateInput, 'type' | 'payload' | 'func' | 'message'> &
  Pick<log, 'user_requested' | 'context' | 'file' | 'at'>;

export type AsyncLocalStore = Partial<{
  tenantSchema: TENANT_NAME;
  idempotencyKey: UUID;
}>;

export type IdempotencyResponseType = {
  statusCode: HttpStatus;
  status: REQUEST_HANDLING_STATUS;
  response: Record<string, any>;
};
