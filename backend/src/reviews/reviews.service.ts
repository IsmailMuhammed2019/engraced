import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.review.findMany({
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getStats() {
    const totalReviews = await this.prisma.review.count();
    const averageRating = await this.prisma.review.aggregate({
      _avg: {
        rating: true,
      },
    });

    // Get rating distribution
    const ratingDistribution = await this.prisma.review.groupBy({
      by: ['rating'],
      _count: {
        rating: true,
      },
    });

    // Get recent reviews (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentReviews = await this.prisma.review.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    return {
      totalReviews,
      averageRating: averageRating._avg.rating || 0,
      ratingDistribution: ratingDistribution.map(item => ({
        rating: item.rating,
        count: item._count.rating,
      })),
      recentReviews,
    };
  }
}
