const bcrypt = require('bcrypt');

async function createAdmin() {
  try {
    // Hash the password with 12 salt rounds (same as in auth service)
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    console.log('Hashed password:', hashedPassword);
    
    // Create the admin user
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: "postgresql://engracedsmile:Tin@@me43..!!@localhost:5432/engracedsmile_db?schema=public"
        }
      }
    });
    
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@engracedsmile.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true
      }
    });
    
    console.log('Admin created successfully:', admin);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createAdmin();
