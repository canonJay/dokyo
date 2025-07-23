import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { UsersModule } from 'src/users/users.module'
import { TagsController } from './tags.controller'
import { TagsService } from './tags.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  imports: [UsersModule],
  controllers: [TagsController],
  providers: [TagsService, PrismaService, S3Service],
  exports: [TagsService],
})
export class TagsModule {}
