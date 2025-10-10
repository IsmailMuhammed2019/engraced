import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async create(createAdminDto: CreateAdminDto, requestingAdminId: string) {
    // Check if requesting admin is SUPER_ADMIN
    const requestingAdmin = await this.prisma.admin.findUnique({
      where: { id: requestingAdminId },
    });

    if (!requestingAdmin || requestingAdmin.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only SUPER_ADMIN can create new admins');
    }

    // Check if email already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: createAdminDto.email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    // Create admin
    const admin = await this.prisma.admin.create({
      data: {
        email: createAdminDto.email,
        password: hashedPassword,
        firstName: createAdminDto.firstName,
        lastName: createAdminDto.lastName,
        role: createAdminDto.role,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return admin;
  }

  async findAll() {
    return this.prisma.admin.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async update(id: string, updateAdminDto: UpdateAdminDto, requestingAdminId: string) {
    // Get requesting admin
    const requestingAdmin = await this.prisma.admin.findUnique({
      where: { id: requestingAdminId },
    });

    if (!requestingAdmin) {
      throw new ForbiddenException('Unauthorized');
    }

    // Get target admin
    const targetAdmin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!targetAdmin) {
      throw new NotFoundException('Admin not found');
    }

    // Only SUPER_ADMIN can update other admins' roles
    if (updateAdminDto.role && requestingAdmin.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only SUPER_ADMIN can change admin roles');
    }

    // Admins can only update themselves unless they're SUPER_ADMIN
    if (id !== requestingAdminId && requestingAdmin.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('You can only update your own profile');
    }

    // Check if email is being changed and if it's already taken
    if (updateAdminDto.email && updateAdminDto.email !== targetAdmin.email) {
      const existingAdmin = await this.prisma.admin.findUnique({
        where: { email: updateAdminDto.email },
      });

      if (existingAdmin) {
        throw new ConflictException('Email already in use');
      }
    }

    // Hash new password if provided
    const updateData: any = { ...updateAdminDto };
    if (updateAdminDto.password) {
      updateData.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    // Update admin
    const updatedAdmin = await this.prisma.admin.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedAdmin;
  }

  async remove(id: string, requestingAdminId: string) {
    // Only SUPER_ADMIN can delete admins
    const requestingAdmin = await this.prisma.admin.findUnique({
      where: { id: requestingAdminId },
    });

    if (!requestingAdmin || requestingAdmin.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only SUPER_ADMIN can delete admins');
    }

    // Cannot delete yourself
    if (id === requestingAdminId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Soft delete by deactivating
    await this.prisma.admin.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Admin deactivated successfully' };
  }

  async delete(id: string, requestingAdminId: string) {
    // Only SUPER_ADMIN can permanently delete admins
    const requestingAdmin = await this.prisma.admin.findUnique({
      where: { id: requestingAdminId },
    });

    if (!requestingAdmin || requestingAdmin.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only SUPER_ADMIN can permanently delete admins');
    }

    // Cannot delete yourself
    if (id === requestingAdminId) {
      throw new ForbiddenException('You cannot delete your own account');
    }

    const admin = await this.prisma.admin.findUnique({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Permanently delete
    await this.prisma.admin.delete({
      where: { id },
    });

    return { message: 'Admin permanently deleted' };
  }

  async getStats() {
    const totalAdmins = await this.prisma.admin.count();
    const activeAdmins = await this.prisma.admin.count({
      where: { isActive: true },
    });
    const superAdmins = await this.prisma.admin.count({
      where: { role: 'SUPER_ADMIN' },
    });
    const regularAdmins = await this.prisma.admin.count({
      where: { role: 'ADMIN' },
    });

    return {
      totalAdmins,
      activeAdmins,
      inactiveAdmins: totalAdmins - activeAdmins,
      superAdmins,
      regularAdmins,
    };
  }
}
