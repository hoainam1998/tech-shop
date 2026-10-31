import { HttpStatus } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaClient, Prisma as PrismaTechShop } from 'generated/prisma/tech-shop';
import { Prisma, LogType, log } from 'generated/prisma/event-source';
import { EVENT_NAME, REQUEST_HANDLING_STATUS, TENANT_NAME } from './enums';
import AlsService from './libs/als/als.service';
import AbortService from './helpers/abort.service';

export type EventPatternType = { cmd: string };

interface PrismaClientWithTimeout extends PrismaTechShop.categoryDelegate {
  category: {
    create: (
      v: PrismaTechShop.categoryCreateArgs | Partial<{ timeout: number; aborted: boolean }>,
    ) => ReturnType<PrismaTechShop.categoryDelegate['create']>;
  } & Omit<PrismaTechShop.categoryDelegate, 'create'>;
}

export type PrismaClientReplica = PrismaClient & {
  $primary: () => Omit<PrismaClientWithTimeout, '$primary' | '$replica'>;
  $replica: () => Omit<PrismaClient, '$primary' | '$replica'>;
};

export type MicroserviceHeaderType = {
  tenant: string;
};

export interface IService {
  readonly [key: string]: any;
  readonly alsService: AlsService;
  readonly abortService: AbortService;
}

export type MessageResponseType = {
  messages: string[];
  message?: string;
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
  id?: UUID;
  message: string;
  func: string;
  type?: LogType;
  payload: LoggingPayloadType;
  file?: string;
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
  timeout?: number;
  receivedAt: number;
  abortSignal: AbortSignal;
}>;

export type IdempotencyResponseType = {
  statusCode: HttpStatus;
  status: REQUEST_HANDLING_STATUS;
  response: Record<string, any>;
};

export type MessageResponseTestingType = {
  messages: string[];
  errorCode?: string;
};

export interface TCPRequest extends Request {
  data: {
    header: {
      tenant: TENANT_NAME;
      timeout?: number;
      user_id?: UUID;
    };
  };
}
