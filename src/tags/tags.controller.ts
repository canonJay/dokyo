import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { TagsService } from './tags.service'

@ApiTags('tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать тег' })
  @ApiBody({ type: CreateTagDto })
  @ApiResponse({ status: 201, description: 'Тег создан', schema: { example: { id: '1', name: 'Tag 1', products: [{ id: 'prod1' }] } } })
  @ApiResponse({ status: 400, description: 'Ошибка создания тега' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @ApiOperation({ summary: 'Получить все теги' })
  @ApiResponse({ status: 200, description: 'Список тегов', schema: { example: [{ id: '1', name: 'Tag 1' }] } })
  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @ApiOperation({ summary: 'Получить тег по id' })
  @ApiParam({ name: 'id', description: 'ID тега' })
  @ApiResponse({ status: 200, description: 'Тег найден', schema: { example: { id: '1', name: 'Tag 1' } } })
  @ApiResponse({ status: 404, description: 'Тег не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить тег' })
  @ApiParam({ name: 'id', description: 'ID тега' })
  @ApiBody({ type: UpdateTagDto })
  @ApiResponse({ status: 200, description: 'Тег обновлён', schema: { example: { id: '1', name: 'Tag 1', products: [{ id: 'prod1' }] } } })
  @ApiResponse({ status: 400, description: 'Ошибка обновления тега' })
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить тег' })
  @ApiParam({ name: 'id', description: 'ID тега' })
  @ApiResponse({ status: 200, description: 'Тег удалён', schema: { example: true } })
  @ApiResponse({ status: 404, description: 'Тег не найден' })
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
