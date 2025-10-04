import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RateLimitService {
  constructor(private prisma: PrismaService) {}

  async checkRateLimit(identifier: string, action: string, maxAttempts: number, windowMinutes: number): Promise<boolean> {
    const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);
    
    const attempts = await this.prisma.rateLimit.findMany({
      where: {
        identifier,
        action,
        createdAt: {
          gte: windowStart,
        },
      },
    });

    if (attempts.length >= maxAttempts) {
      return false; // Rate limit exceeded
    }

    // Record this attempt
    await this.prisma.rateLimit.create({
      data: {
        identifier,
        action,
        createdAt: new Date(),
      },
    });

    return true; // Within rate limit
  }

  async cleanupOldRecords() {
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
    
    await this.prisma.rateLimit.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
      },
    });
  }
}
