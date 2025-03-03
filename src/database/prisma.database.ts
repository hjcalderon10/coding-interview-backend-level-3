import { LoggerService } from '@/services/logger/logger.service';
import { PrismaClient } from '@prisma/client';

export class PrismaDB {
  private static instance: PrismaClient;

  private constructor() {}

  static getClient(): PrismaClient {
    if (!this.instance) {
      this.instance = new PrismaClient();
      LoggerService.info('Prisma connected to database');
    }
    return this.instance;
  }
}
