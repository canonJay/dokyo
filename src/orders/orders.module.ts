import { Module } from '@nestjs/common'
import { PaymentsModule } from 'src/payments/payments.module'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from 'src/products/products.service'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'

@Module({
  imports: [PaymentsModule],
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService, ProductsService],
})
export class OrdersModule {}
