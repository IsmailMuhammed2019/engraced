const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSamplePayments() {
  try {
    console.log('Creating sample payments...');

    // First, create a sample user if it doesn't exist
    const user = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
        phone: '+2348071116229',
      },
    });

    // Create a sample route
    const route = await prisma.route.upsert({
      where: {
        from_to: {
          from: 'Lagos',
          to: 'Abuja',
        },
      },
      update: {},
      create: {
        from: 'Lagos',
        to: 'Abuja',
        distance: 500,
        duration: 8,
        basePrice: 15000,
        isActive: true,
      },
    });

    // Create a sample driver
    const driver = await prisma.driver.upsert({
      where: { email: 'driver@example.com' },
      update: {},
      create: {
        email: 'driver@example.com',
        firstName: 'John',
        lastName: 'Driver',
        phone: '+2348071116228',
        licenseNumber: 'LIC123456',
        licenseExpiry: new Date('2025-12-31'),
        address: 'Lagos, Nigeria',
        isActive: true,
      },
    });

    // Create a sample vehicle
    const vehicle = await prisma.vehicle.upsert({
      where: { plateNumber: 'LAG123ABC' },
      update: {},
      create: {
        plateNumber: 'LAG123ABC',
        make: 'Toyota',
        model: 'Sienna',
        year: 2023,
        capacity: 7,
        features: ['Air Conditioning', 'WiFi'],
        isActive: true,
      },
    });

    // Create a sample trip
    const trip = await prisma.trip.create({
      data: {
        routeId: route.id,
        driverId: driver.id,
        vehicleId: vehicle.id,
        departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        arrivalTime: new Date(Date.now() + 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // Tomorrow + 8 hours
        price: 15000,
        maxPassengers: 7,
        features: ['Wi-Fi', 'Refreshments'],
        amenities: ['Air Conditioning', 'Reclining Seats'],
      },
    });

    // Create sample bookings
    const bookings = [];
    for (let i = 1; i <= 5; i++) {
      const booking = await prisma.booking.create({
        data: {
          userId: user.id,
          tripId: trip.id,
          seatNumber: i,
          bookingNumber: `ENG${Date.now()}${i}`,
          status: 'CONFIRMED',
          totalAmount: 15000,
        },
      });
      bookings.push(booking);
    }

    // Create sample payments
    const payments = [];
    const statuses = ['PAID', 'PENDING', 'FAILED'];
    const methods = ['Card', 'Bank Transfer', 'Mobile Money'];

    for (let i = 0; i < bookings.length; i++) {
      const booking = bookings[i];
      const status = statuses[i % statuses.length];
      const method = methods[i % methods.length];
      
      const payment = await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: booking.totalAmount,
          paystackRef: `ENG_${booking.id}_${Date.now()}_${i}`,
          paymentStatus: status,
          paymentMethod: method,
          paymentDate: status === 'PAID' ? new Date() : null,
          failureReason: status === 'FAILED' ? 'Insufficient funds' : null,
        },
      });
      payments.push(payment);
    }

    console.log(`✅ Created ${payments.length} sample payments`);
    console.log('Sample payment data created successfully!');

  } catch (error) {
    console.error('Error creating sample payments:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSamplePayments();
