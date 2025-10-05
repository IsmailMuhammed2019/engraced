import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { DriversModule } from '../drivers/drivers.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [CloudinaryModule, VehiclesModule, DriversModule],
  controllers: [UploadController],
})
export class UploadModule {}
