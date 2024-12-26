import { PrismaClient } from '@prisma/client';


const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || new PrismaClient();

if (!prisma.$connect) {
    console.log('Error: Prisma client is not connected.');
  }

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}


