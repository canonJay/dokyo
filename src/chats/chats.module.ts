import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, PrismaService, S3Service],
  exports: [ChatsService],
})
export class ChatsModule {}
