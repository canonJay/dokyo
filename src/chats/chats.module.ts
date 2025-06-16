import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ChatsController } from './chats.controller'
import { ChatsService } from './chats.service'

@Module({
  controllers: [ChatsController],
  providers: [ChatsService, PrismaService],
  exports: [ChatsService],
})
export class ChatsModule {}
