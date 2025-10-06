import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { EmailModule } from '../email/email.module';
import { PromotionsModule } from '../promotions/promotions.module';

@Module({
  imports: [EmailModule, PromotionsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
