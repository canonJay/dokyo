import { Module } from '@nestjs/common'
import { PaymentsModule } from 'src/payments/payments.module'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from 'src/products/products.service'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { ProductImageService } from 'src/products/product-image.service'

@Module({
  imports: [PaymentsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, ProductsService, ProductImageService],
})
export class OrdersModule {}
