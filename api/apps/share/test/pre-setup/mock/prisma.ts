export const eventSourcePrisma = {
  log: {
    create: jest.fn(),
  },
};

const prisma = {
  category: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

export const techShopPrisma: any = prisma;

export default {
  $primary: () => prisma,
} as any;
