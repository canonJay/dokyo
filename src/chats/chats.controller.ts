import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
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
