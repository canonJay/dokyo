import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersModule } from 'src/users/users.module'
import { ProductsController } from './products.controller'
import { ProductsService } from './products.service'
import { ProductImageService } from './product-image.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  imports: [UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService, ProductImageService,
    S3Service
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
