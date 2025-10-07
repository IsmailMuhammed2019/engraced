import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalUsers,
      totalRoutes,
      totalBookings,
      totalRevenue,
      recentBookings,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.route.count({ where: { isActive: true } }),
      this.prisma.booking.count(),
      this.prisma.booking.aggregate({
        _sum: { totalAmount: true },
      }),
      this.prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          route: {
            select: { from: true, to: true },
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalRoutes,
      totalBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentBookings,
    };
  }

  // Settings Management
  async getAllSettings() {
    const settings = await this.prisma.systemSettings.findMany();
    
    // Convert to key-value object
    const settingsObj: any = {};
    settings.forEach(setting => {
      let value: any = setting.value;
      
      // Parse value based on type
      switch (setting.type) {
        case 'boolean':
          value = value === 'true';
          break;
        case 'number':
          value = parseFloat(value);
          break;
        case 'json':
          try {
            value = JSON.parse(value);
          } catch (e) {
            value = setting.value;
          }
          break;
        default:
          value = setting.value;
      }
      
      settingsObj[setting.key] = value;
    });
    
    return settingsObj;
  }

  async getSetting(key: string) {
    const setting = await this.prisma.systemSettings.findUnique({
      where: { key },
    });
    
    if (!setting) {
      return null;
    }
    
    let value: any = setting.value;
    switch (setting.type) {
      case 'boolean':
        value = value === 'true';
        break;
      case 'number':
        value = parseFloat(value);
        break;
      case 'json':
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = setting.value;
        }
        break;
    }
    
    return value;
  }

  async updateSetting(key: string, value: any, type: string = 'string') {
    let stringValue = value;
    
    if (type === 'json') {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = String(value);
    }
    
    return this.prisma.systemSettings.upsert({
      where: { key },
      update: { value: stringValue, type },
      create: { key, value: stringValue, type },
    });
  }

  async updateMultipleSettings(settings: Array<{key: string; value: any; type?: string}>) {
    const promises = settings.map(setting => 
      this.updateSetting(setting.key, setting.value, setting.type || 'string')
    );
    
    await Promise.all(promises);
    
    return this.getAllSettings();
  }

  async deleteSetting(key: string) {
    return this.prisma.systemSettings.delete({
      where: { key },
    });
  }
}
