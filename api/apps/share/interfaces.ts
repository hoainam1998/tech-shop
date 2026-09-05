import { HttpStatus } from '@nestjs/common';
import { PrismaClient } from 'generated/prisma/tech-shop';
import { Prisma, LogType, log } from 'generated/prisma/event-source';
import TenantNameService from '@share/helpers/tenant-name.service';
import { EVENT_NAME } from './enums';

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
  readonly tenantService: TenantNameService;
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
  id?: string;
  message: string;
  func: string;
  type?: LogType;
  payload: LoggingPayloadType;
};

export type AsyncLoggingJobData = Omit<LoggingJobData, 'payload'> & {
  payload: LoggingPayloadType | (number | string)[];
};

export type MailingJobData = Pick<Prisma.logCreateInput, 'type' | 'payload' | 'func' | 'message'> &
  Pick<log, 'user_requested' | 'context' | 'file' | 'at'>;
