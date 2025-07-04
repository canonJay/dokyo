import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersModule } from 'src/users/users.module'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'

@Module({
  imports: [UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  exports: [ProductsService],
})
export class ProductsModule {}
