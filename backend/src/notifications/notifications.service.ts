import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getAdminNotifications(adminId?: string) {
    return this.prisma.notification.findMany({
      where: adminId ? { adminId } : { adminId: { not: null } },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 notifications
    });
  }

  async getUnreadCount(adminId?: string) {
    const count = await this.prisma.notification.count({
      where: {
        adminId: adminId || { not: null },
        isRead: false,
      },
    });
    
    return { count };
  }

  async markAsRead(notificationId: string) {
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(adminId?: string) {
    return this.prisma.notification.updateMany({
      where: {
        adminId: adminId || { not: null },
        isRead: false,
      },
      data: { isRead: true },
    });
  }

  async deleteNotification(notificationId: string) {
    return this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }
}

