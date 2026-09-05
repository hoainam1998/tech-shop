import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import Service from '@share/helpers/service';
import { AsyncLoggingJobData } from '@share/interfaces';
import { createMessage } from '@share/utils';

type LoggingFunctionParametersType = {
  logger: Service['Logger'];
  status: HttpStatus;
  message: string;
  func: string;
  payload: AsyncLoggingJobData['payload'];
};

const logError = (args: LoggingFunctionParametersType): void => {
  if (args.status === HttpStatus.NOT_FOUND) {
    void args.logger.warn({ message: args.message, func: args.func, payload: args.payload });
  } else {
    void args.logger.error({ message: args.message, func: args.func, payload: args.payload });
  }
};

export default function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {
  const originMethod = descriptor.value!;
  descriptor.value = function (...args: any[]) {
    const msgs = (this as Service).Messages;
    const logger = (this as Service).Logger;
    return originMethod.apply(this, args).catch((error: any) => {
      const logInfo = {
        message: error.message,
        func: propertyName,
        payload: args as (string | number)[],
      };

      if (error instanceof RpcException) {
        const status = (error.getError() as any).status as HttpStatus;
        logError({ logger, status, ...logInfo });
        throw error;
      } else if (error instanceof HttpException) {
        const status = error.getStatus();
        logError({ logger, status, ...logInfo });
        throw new RpcException(error);
      } else {
        void logger.error(logInfo);
        throw new RpcException(new BadRequestException(createMessage(msgs.COMMON.COMMON_ERROR)));
      }
    });
  };
  return descriptor;
}
