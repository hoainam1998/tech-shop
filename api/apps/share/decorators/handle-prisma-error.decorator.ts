import { BadRequestException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Prisma } from 'generated/prisma/tech-shop';
import { PRISMA_ERROR_CODE } from '@share/enums';
import Service from '@share/helpers/service';

type Status = {
  NotFound?: HttpStatus;
  BadRequest?: HttpStatus;
};

export default (status?: Status) => (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) => {
  const originMethod = descriptor.value;
  descriptor.value = function (...args: any[]) {
    const msgs = (this as Service).Messages;
    const logger = (this as Service).Logger;
    return originMethod?.apply(this, args).catch((error: Error) => {
      void logger.error({
        message: error.message,
        func: propertyName,
        payload: args,
      });
      switch (true) {
        case error instanceof Prisma.PrismaClientInitializationError:
          if (
            error.errorCode === PRISMA_ERROR_CODE.DATABASE_LOST_CONNECT ||
            error.message.includes("Can't reach database server")
          ) {
            throw new RpcException(new BadRequestException(error.message));
          }
          throw error;
        case error instanceof Prisma.PrismaClientValidationError:
          throw new RpcException(new BadRequestException(msgs.DATABASE.MUTATING_DATABASE_ERROR));
        case error instanceof Prisma.PrismaClientKnownRequestError:
          if (error.code === PRISMA_ERROR_CODE.DO_NOT_HAVE_PERMISSION) {
            throw new RpcException(new BadRequestException(msgs.DATABASE.DO_NOT_HAVE_PERMISSION));
          } else if (error.code === PRISMA_ERROR_CODE.ALREADY_EXIST) {
            throw new RpcException(new BadRequestException(msgs.DATABASE.ALREADY_EXIST));
          } else if (error.code === PRISMA_ERROR_CODE.NOT_FOUND) {
            if (status && status.NotFound) {
              switch (status.NotFound) {
                case HttpStatus.BAD_REQUEST:
                  throw new RpcException(new BadRequestException(msgs.NOT_FOUND));
                case HttpStatus.UNAUTHORIZED:
                  throw new RpcException(new UnauthorizedException(msgs.NOT_FOUND));
                default:
                  throw new RpcException(new NotFoundException(msgs.NOT_FOUND));
              }
            } else {
              throw new RpcException(new NotFoundException(msgs.NOT_FOUND));
            }
          }

          throw error;
        default:
          throw error;
      }
    });
  };
};
