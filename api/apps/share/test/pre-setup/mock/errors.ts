import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Prisma } from 'generated/prisma/tech-shop/default';
import { PRISMA_ERROR_CODE } from '@share/enums';

/** JWT error */
const currentDate = new Date();
const expiredDate = new Date(currentDate.setDate(currentDate.getDate() - 1));

export const JsonWebTokenUnknownError = new JsonWebTokenError('jwt unknown error');
export const JsonWebTokenExpiredError = new TokenExpiredError('jwt expired', expiredDate);
export const JsonWebTokenMalformedError = new JsonWebTokenError('jwt malformed');

/** Prisma error */
const PRISMA_VERSION = 'v1';

export const PrismaNotFoundError = new Prisma.PrismaClientKnownRequestError('Data queried not found!', {
  code: PRISMA_ERROR_CODE.NOT_FOUND,
  clientVersion: PRISMA_VERSION,
});

export const PrismaDisconnectError = new Prisma.PrismaClientInitializationError(
  "Can't reach database server",
  PRISMA_VERSION,
  PRISMA_ERROR_CODE.DATABASE_LOST_CONNECT,
);

export const PrismaNotHavePermission = new Prisma.PrismaClientKnownRequestError(
  'You do not have permission access this table!',
  {
    code: PRISMA_ERROR_CODE.DO_NOT_HAVE_PERMISSION,
    clientVersion: PRISMA_VERSION,
  },
);

/** Unknown error */
export const UnknownError = new Error('unknown error');
