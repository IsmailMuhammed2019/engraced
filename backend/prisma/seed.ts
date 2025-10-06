import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create default admin
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@engracedsmile.com' },
    update: {},
    create: {
      email: 'admin@engracedsmile.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'SUPER_ADMIN',
    },
  });

  console.log('✅ Created admin user:', admin.email);

  // Get or create a driver for sample trips (only if needed)
  let driver = await prisma.driver.findFirst();
  
  if (!driver) {
    // Only create a sample driver if none exist and we need one for trips
    driver = await prisma.driver.create({
      data: {
        firstName: 'Sample',
        lastName: 'Driver',
        email: 'sample@engracedsmile.com',
        phone: '+2348071116229',
        licenseNumber: 'SAMPLE123456',
        licenseExpiry: new Date('2025-12-31'),
        address: 'Lagos, Nigeria',
        isActive: true,
      },
    });
    console.log('✅ Created sample driver for trips:', driver.email);
  } else {
    console.log('✅ Using existing driver for trips:', driver.email);
  }

  // Create sample vehicle
  const vehicle = await prisma.vehicle.upsert({
    where: { plateNumber: 'LAG123ABC' },
    update: {},
    create: {
      plateNumber: 'LAG123ABC',
      make: 'Toyota',
      model: 'Sienna',
      year: 2023,
      capacity: 7,
      features: ['Air Conditioning', 'WiFi', 'Comfortable Seats', 'USB Charging'],
      isActive: true,
    },
  });

  console.log('✅ Created vehicle:', vehicle.plateNumber);

  // Create sample routes
  const routes = [
    {
      from: 'Lagos',
      to: 'Abuja',
      distance: 720,
      duration: 510,
      basePrice: 7500,
      description: 'Premium route connecting Nigeria\'s commercial capital with the federal capital',
      adminId: admin.id,
    },
    {
      from: 'Lagos',
      to: 'Port Harcourt',
      distance: 540,
      duration: 360,
      basePrice: 6200,
      description: 'Connect to the oil-rich Niger Delta region',
      adminId: admin.id,
    },
    {
      from: 'Abuja',
      to: 'Kaduna',
      distance: 200,
      duration: 135,
      basePrice: 2000,
      description: 'Quick connection between the capital and northern Nigeria',
      adminId: admin.id,
    },
    {
      from: 'Kano',
      to: 'Lagos',
      distance: 1000,
      duration: 720,
      basePrice: 12000,
      description: 'Premium overnight service connecting northern and southern Nigeria',
      adminId: admin.id,
    },
    {
      from: 'Ibadan',
      to: 'Abuja',
      distance: 650,
      duration: 465,
      basePrice: 6800,
      description: 'Connect the ancient city of Ibadan with the modern capital',
      adminId: admin.id,
    },
    {
      from: 'Enugu',
      to: 'Lagos',
      distance: 750,
      duration: 570,
      basePrice: 8500,
      description: 'Eastern Nigeria to Lagos connection',
      adminId: admin.id,
    },
  ];

  for (const routeData of routes) {
    const route = await prisma.route.upsert({
      where: { 
        from_to: {
          from: routeData.from,
          to: routeData.to,
        }
      },
      update: {},
      create: routeData,
    });

    console.log(`✅ Created route: ${route.from} → ${route.to}`);

    // Create sample trips for each route
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const trips = [
      {
        routeId: route.id,
        driverId: driver.id,
        vehicleId: vehicle.id,
        departureTime: new Date(tomorrow.setHours(6, 0, 0, 0)),
        arrivalTime: new Date(tomorrow.setHours(14, 30, 0, 0)),
        price: route.basePrice,
        maxPassengers: 7,
        features: ['Wi-Fi', 'Refreshments', 'Comfortable Seats'],
        amenities: ['Air Conditioning', 'Reclining Seats', 'Onboard Toilet', 'Free Wi-Fi'],
      },
      {
        routeId: route.id,
        driverId: driver.id,
        vehicleId: vehicle.id,
        departureTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
        arrivalTime: new Date(tomorrow.setHours(20, 30, 0, 0)),
        price: route.basePrice,
        maxPassengers: 7,
        features: ['Wi-Fi', 'Refreshments', 'Comfortable Seats'],
        amenities: ['Air Conditioning', 'Reclining Seats', 'Onboard Toilet', 'Free Wi-Fi'],
      },
    ];

    for (const tripData of trips) {
      const trip = await prisma.trip.create({
        data: tripData,
      });
      console.log(`  ✅ Created trip: ${trip.departureTime.toLocaleTimeString()}`);
    }
  }

  // Create sample users
  const users = [
    {
      email: 'john@example.com',
      password: await bcrypt.hash('password123', 12),
      firstName: 'John',
      lastName: 'Doe',
      phone: '+2348071116229',
    },
    {
      email: 'jane@example.com',
      password: await bcrypt.hash('password123', 12),
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+2348071116230',
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`✅ Created user: ${user.email}`);
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
