import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { ChatsService } from './chats.service'
import { CreateChatDto } from './dto/create-chat.dto'

@ApiTags('chats')
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать чат между пользователями' })
  @ApiBody({ type: CreateChatDto })
  @ApiResponse({ status: 201, description: 'Чат создан', schema: { example: { id: '...', users: [{ id: '...', email: '...' }], messages: [] } } })
  @ApiResponse({ status: 400, description: 'Ошибка создания чата' })
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Authorization()
  @ApiOperation({ summary: 'Создать чат с поддержкой' })
  @ApiResponse({ status: 201, description: 'Чат с поддержкой создан', schema: { example: { id: '...', users: [{ id: '...', email: '...' }], messages: [] } } })
  @ApiResponse({ status: 400, description: 'Нет доступных сотрудников поддержки' })
  @Post('createSupportChat')
  async createSupportChat(@Authorized("id") id: string){
    return this.chatsService.createSupportChat(id)
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить свои чаты' })
  @ApiResponse({ status: 200, description: 'Список чатов пользователя', schema: { example: [{ id: '...', users: [{ id: '...' }], messages: [] }] } })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @Get()
  findMyChats(@Authorized() userId: string) {
    return this.chatsService.findMyChats(userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить чат между двумя пользователями' })
  @ApiParam({ name: 'userId', description: 'ID второго пользователя' })
  @ApiResponse({ status: 200, description: 'Чат найден', schema: { example: { id: '...', users: [{ id: '...' }], messages: [] } } })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  @Get('/getMyChatByUserId/:userId')
  async getMyChatById(@Param('userId') userId: string, @Authorized('id') authUserid: string) {
    return await this.chatsService.getMyChatByUserId(userId, authUserid)
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить чат по id' })
  @ApiParam({ name: 'id', description: 'ID чата' })
  @ApiResponse({ status: 200, description: 'Чат найден', schema: { example: { id: '...', users: [{ id: '...' }], messages: [] } } })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  @Get(':id')
  findOne(@Param('id') id: string, @Authorized() userId: string) {
    return this.chatsService.findOne(id, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить чат по id' })
  @ApiParam({ name: 'id', description: 'ID чата' })
  @ApiResponse({ status: 200, description: 'Чат удалён', schema: { example: true } })
  @ApiResponse({ status: 404, description: 'Чат не найден' })
  @Delete(':id')
  remove(@Param('id') id: string, @Authorized() userId: string) {
    return this.chatsService.remove(id, userId);
  }
}
