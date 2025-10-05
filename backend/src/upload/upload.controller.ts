import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { DriversService } from '../drivers/drivers.service';

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@ApiTags('Upload')
@Controller('upload')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class UploadController {
  constructor(
    private cloudinaryService: CloudinaryService,
    private vehiclesService: VehiclesService,
    private driversService: DriversService,
  ) {}

  @Post('vehicles/:id/images')
  @UseInterceptors(FilesInterceptor('images', 6)) // Max 6 images
  @ApiOperation({ summary: 'Upload vehicle images (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Images uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async uploadVehicleImages(
    @Param('id') vehicleId: string,
    @UploadedFiles() files: MulterFile[],
    @Request() req,
  ) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can upload vehicle images');
    }

    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    if (files.length > 6) {
      throw new Error('Maximum 6 images allowed per vehicle');
    }

    // Upload images to Cloudinary
    const uploadResults = await this.cloudinaryService.uploadMultipleImages(
      files,
      `vehicles/${vehicleId}`,
    );

    // Extract URLs from upload results
    const imageUrls = uploadResults.map(result => result.url);

    // Update vehicle with new images
    const updatedVehicle = await this.vehiclesService.addImages(vehicleId, imageUrls);

    return {
      message: 'Vehicle images uploaded successfully',
      data: {
        vehicleId,
        images: imageUrls,
        vehicle: updatedVehicle,
      },
    };
  }

  @Post('drivers/:id/image')
  @UseInterceptors(FilesInterceptor('image', 1)) // Max 1 image
  @ApiOperation({ summary: 'Upload driver profile image (Admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Image uploaded successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Driver not found' })
  async uploadDriverImage(
    @Param('id') driverId: string,
    @UploadedFiles() files: MulterFile[],
    @Request() req,
  ) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can upload driver images');
    }

    if (!files || files.length === 0) {
      throw new Error('No file uploaded');
    }

    // Upload image to Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImage(
      files[0],
      `drivers/${driverId}`,
      `driver-${driverId}-${Date.now()}`,
    );

    // Update driver with new profile image
    const updatedDriver = await this.driversService.updateProfileImage(
      driverId,
      uploadResult.url,
    );

    return {
      message: 'Driver profile image uploaded successfully',
      data: {
        driverId,
        profileImage: uploadResult.url,
        driver: updatedDriver,
      },
    };
  }

  @Delete('vehicles/:id/images/:imageIndex')
  @ApiOperation({ summary: 'Delete vehicle image (Admin only)' })
  @ApiResponse({ status: 200, description: 'Image deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Vehicle or image not found' })
  async deleteVehicleImage(
    @Param('id') vehicleId: string,
    @Param('imageIndex') imageIndex: string,
    @Request() req,
  ) {
    if (req.user.type !== 'admin') {
      throw new Error('Only admins can delete vehicle images');
    }

    const index = parseInt(imageIndex);
    if (isNaN(index) || index < 0) {
      throw new Error('Invalid image index');
    }

    // Get vehicle to find the image URL
    const vehicle = await this.vehiclesService.findOne(vehicleId);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    if (index >= vehicle.images.length) {
      throw new Error('Image index out of range');
    }

    // Remove image from vehicle
    const updatedVehicle = await this.vehiclesService.removeImage(vehicleId, index);

    return {
      message: 'Vehicle image deleted successfully',
      data: {
        vehicleId,
        vehicle: updatedVehicle,
      },
    };
  }
}
