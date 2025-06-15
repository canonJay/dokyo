import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersModule } from 'src/users/users.module'
import { ReviewsController } from './reviews.controller'
import { ReviewsService } from './reviews.service'

@Module({
  imports: [UsersModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, PrismaService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
