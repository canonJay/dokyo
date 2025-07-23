import { Module } from '@nestjs/common'
import { PaymentsModule } from 'src/payments/payments.module'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from 'src/products/products.service'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { ProductImageService } from 'src/products/product-image.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  imports: [PaymentsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, ProductsService, ProductImageService, S3Service],
})
export class OrdersModule {}
