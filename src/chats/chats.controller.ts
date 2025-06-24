import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Authorization()
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Authorization(Role.USER)
  @Post("createSupportChat")
  async createSupportChat(@Authorized("id") userId: string){
    return this.chatsService.createSupportChat(userId)
  }

  @Authorization()
  @Get()
  findMyChats(@Authorized() userId: string) {
    return this.chatsService.findMyChats(userId);
  }



  @Authorization()
  @Get(':id')
  findOne(@Param('id') id: string, @Authorized() userId: string) {
    return this.chatsService.findOne(id, userId);
  }

  @Authorization()
  @Delete(':id')
  remove(@Param('id') id: string, @Authorized() userId: string) {
    return this.chatsService.remove(id, userId);
  }
}
