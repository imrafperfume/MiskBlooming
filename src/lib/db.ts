import 'server-only';
import { PrismaClient } from '@prisma/client';

type GlobalWithPrisma = typeof globalThis & { prisma?: PrismaClient };

const g = globalThis as GlobalWithPrisma;
export const prisma = g.prisma ?? (g.prisma = new PrismaClient());