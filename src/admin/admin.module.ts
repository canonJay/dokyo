import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { PaymentsService } from 'src/payments/payments.service'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from 'src/products/products.service'
import { ReviewsService } from 'src/reviews/reviews.service'
import { UsersService } from 'src/users/users.service'
import { AdminController } from './admin.controller'
import { ProductImageService } from 'src/products/product-image.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  imports: [HttpModule],
  controllers: [AdminController],
  providers: [UsersService, ReviewsService, ProductsService, PrismaService, PaymentsService, ProductImageService, S3Service],
})
export class AdminModule {}
