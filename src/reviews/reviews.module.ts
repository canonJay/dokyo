import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersModule } from 'src/users/users.module'
import { ReviewsController } from './reviews.controller'
import { ReviewsService } from './reviews.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  imports: [UsersModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService, S3Service],
  exports: [ReviewsService],
})
export class ReviewsModule {}
