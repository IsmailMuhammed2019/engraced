import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminsModule } from './admins/admins.module';
import { RoutesModule } from './routes/routes.module';
import { TripsModule } from './trips/trips.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SystemModule } from './system/system.module';
import { DriversModule } from './drivers/drivers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { PaymentsModule } from './payments/payments.module';
import { EmailModule } from './email/email.module';
import { HealthModule } from './health/health.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    AdminsModule,
    RoutesModule,
    TripsModule,
    BookingsModule,
    ReviewsModule,
    SystemModule,
    DriversModule,
    VehiclesModule,
    PaymentsModule,
    EmailModule,
    HealthModule,
    UploadModule,
  ],
})
export class AppModule {}
