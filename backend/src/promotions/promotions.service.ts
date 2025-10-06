import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async create(createPromotionDto: CreatePromotionDto) {
    // Generate unique promotion code if not provided
    const code = createPromotionDto.code || `PROMO${Date.now().toString().slice(-6)}`;
    
    return this.prisma.promotion.create({
      data: {
        title: createPromotionDto.name,
        description: createPromotionDto.description,
        code,
        type: createPromotionDto.type.toUpperCase() as any,
        value: parseFloat(createPromotionDto.value),
        startDate: new Date(createPromotionDto.startDate),
        endDate: new Date(createPromotionDto.endDate),
        usageLimit: createPromotionDto.maxUsage,
        isActive: createPromotionDto.status === 'active' || true,
      },
    });
  }

  async findAll() {
    return this.prisma.promotion.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findActive() {
    const now = new Date();
    return this.prisma.promotion.findMany({
      where: {
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });
    
    if (!promotion) {
      throw new NotFoundException('Promotion not found');
    }
    
    return promotion;
  }

  async update(id: string, updatePromotionDto: UpdatePromotionDto) {
    await this.findOne(id); // Check if promotion exists
    
    return this.prisma.promotion.update({
      where: { id },
      data: {
        ...(updatePromotionDto.name && { title: updatePromotionDto.name }),
        ...(updatePromotionDto.description && { description: updatePromotionDto.description }),
        ...(updatePromotionDto.type && { type: updatePromotionDto.type.toUpperCase() as any }),
        ...(updatePromotionDto.value && { value: parseFloat(updatePromotionDto.value) }),
        ...(updatePromotionDto.startDate && { startDate: new Date(updatePromotionDto.startDate) }),
        ...(updatePromotionDto.endDate && { endDate: new Date(updatePromotionDto.endDate) }),
        ...(updatePromotionDto.maxUsage && { usageLimit: updatePromotionDto.maxUsage }),
        ...(updatePromotionDto.status && { isActive: updatePromotionDto.status === 'active' }),
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Check if promotion exists
    
    return this.prisma.promotion.delete({
      where: { id },
    });
  }

  async getPromotionStats() {
    const [totalPromotions, activePromotions, expiredPromotions] = await Promise.all([
      this.prisma.promotion.count(),
      this.prisma.promotion.count({
        where: {
          isActive: true,
          startDate: { lte: new Date() },
          endDate: { gte: new Date() },
        },
      }),
      this.prisma.promotion.count({
        where: {
          endDate: { lt: new Date() },
        },
      }),
    ]);

    return {
      totalPromotions,
      activePromotions,
      expiredPromotions,
      inactivePromotions: totalPromotions - activePromotions - expiredPromotions,
    };
  }

  async validatePromotion(promotionCode: string, userId: string, routeId: string, amount: number) {
    const promotion = await this.prisma.promotion.findUnique({
      where: { code: promotionCode },
    });

    if (!promotion) {
      throw new NotFoundException('Promotion code not found');
    }

    const now = new Date();
    
    // Check if promotion is active and within date range
    if (!promotion.isActive || promotion.startDate > now || promotion.endDate < now) {
      throw new Error('Promotion is not currently active');
    }

    // Check usage limit
    if (promotion.usageLimit && promotion.usedCount >= promotion.usageLimit) {
      throw new Error('Promotion usage limit exceeded');
    }

    // Check minimum amount requirement
    if (promotion.minAmount && amount < promotion.minAmount.toNumber()) {
      throw new Error(`Minimum amount of ₦${promotion.minAmount} required for this promotion`);
    }

    return promotion;
  }

  async applyPromotion(promotionId: string, bookingId: string) {
    // Increment usage count
    await this.prisma.promotion.update({
      where: { id: promotionId },
      data: {
        usedCount: {
          increment: 1,
        },
      },
    });

    // Link promotion to booking
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        promotionId,
      },
    });
  }

  async calculateDiscount(promotion: any, amount: number): Promise<{ discountAmount: number; finalAmount: number }> {
    let discountAmount = 0;

    switch (promotion.type) {
      case 'PERCENTAGE':
        discountAmount = (amount * promotion.value) / 100;
        if (promotion.maxDiscount && discountAmount > promotion.maxDiscount) {
          discountAmount = promotion.maxDiscount;
        }
        break;
      case 'FIXED_AMOUNT':
        discountAmount = promotion.value;
        break;
      case 'FREE_RIDE':
        discountAmount = amount;
        break;
    }

    const finalAmount = Math.max(0, amount - discountAmount);
    
    return {
      discountAmount,
      finalAmount,
    };
  }
}
