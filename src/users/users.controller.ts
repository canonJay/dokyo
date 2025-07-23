import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UploadedFile } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе найдена' })
  @ApiResponse({ status: 401, description: 'Неавторизован' })
  @Get('me')
  async getMe(@Authorized("id") userId: string) {
    return await this.usersService.findById(userId)
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить аватар пользователя' })
  @ApiResponse({ status: 200, description: 'Аватар пользователя обновлён' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiParam({ name: 'id', description: 'ID пользователя', required: true })
  @Patch("updateAvatar/:id")
  async updateAvatar(@Param("id") id: string, @UploadedFile() avatar: File) {

    return this.usersService.updateAvatar(id, avatar)
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить пользователя по id (публично)' })
  @ApiResponse({ status: 200, description: 'Публичная информация о пользователе' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiParam({ name: 'id', description: 'ID пользователя', required: true })
  @Get("getUserById/:id")
  async getUserById(@Param("id") id: string) {
    return this.usersService.publicFindById(id) 
  }

  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь создан' })
  @ApiResponse({ status: 400, description: 'Ошибка создания пользователя' })
  @ApiBody({ type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь обновлён' })
  @ApiResponse({ status: 400, description: 'Ошибка обновления пользователя' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
  update( @Body() updateUserDto: UpdateUserDto, @Authorized("id") userId: string) {
    return this.usersService.update(updateUserDto, userId);
  }

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь удалён' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @Delete('me')
  remove(@Authorized("id") userId: string) {
    return this.usersService.remove(userId);
  }
}
