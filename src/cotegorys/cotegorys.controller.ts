import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { CotegorysService } from './cotegorys.service'
import { CreateCotegoryDto, CreateSubcategoryDto } from './dto/create-cotegory.dto'
import { UpdateCotegoryDto } from './dto/update-cotegory.dto'

@ApiTags('categories')
@Controller('cotegorys')
export class CotegorysController {
  constructor(private readonly cotegorysService: CotegorysService) {}

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать категорию', description: 'Требуется роль ADMIN' })
  @ApiBody({ type: CreateCotegoryDto })
  @ApiResponse({ status: 201, description: 'Категория создана', schema: { example: { id: '1', name: 'Electronics', products: [] } } })
  @ApiResponse({ status: 400, description: 'Ошибка создания категории' })
  @Post()
  create(@Body() createCotegoryDto: CreateCotegoryDto) {
    return this.cotegorysService.create(createCotegoryDto);
  }

  @ApiOperation({ summary: 'Получить все категории', description: 'Доступно всем ролям' })
  @ApiResponse({ status: 200, description: 'Список категорий', schema: { example: [{ id: '1', name: 'Electronics', products: [] }] } })
  @Get()
  findAll() {
    return this.cotegorysService.findAll();
  }
  
  @ApiOperation({ summary: 'Получить категорию по id', description: 'Доступно всем ролям' })
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiResponse({ status: 200, description: 'Категория найдена', schema: { example: { id: '1', name: 'Electronics', products: [] } } })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cotegorysService.findOne(id);
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить категорию', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiBody({ type: UpdateCotegoryDto })
  @ApiResponse({ status: 200, description: 'Категория обновлена', schema: { example: { id: '1', name: 'Electronics', products: [] } } })
  @ApiResponse({ status: 400, description: 'Ошибка обновления категории' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCotegoryDto: UpdateCotegoryDto) {
    return this.cotegorysService.update(id, updateCotegoryDto);
  }

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить продукт в категорию', description: 'Требуется роль SALLER' })
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiParam({ name: 'productId', description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Продукт добавлен в категорию', schema: { example: { id: '1', name: 'Electronics', products: [{ id: 'prod1' }] } } })
  @ApiResponse({ status: 400, description: 'Ошибка добавления продукта' })
  @Patch(':id/products/:productId')
  addProductToCategory(@Param('id') id: string, @Param('productId') productId: string) {
    return this.cotegorysService.addProductToCategory(id, productId);
  }

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить продукт из категории', description: 'Требуется роль SALLER' })
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiParam({ name: 'productId', description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Продукт удалён из категории', schema: { example: { id: '1', name: 'Electronics', products: [] } } })
  @ApiResponse({ status: 400, description: 'Ошибка удаления продукта' })
  @Delete(':id/products/:productId')
  removeProductFromCategory(@Param('id') id: string, @Param('productId') productId: string) {
    return this.cotegorysService.removeProductFromCategory(id, productId);
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить категорию', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID категории' })
  @ApiResponse({ status: 200, description: 'Категория удалена', schema: { example: true } })
  @ApiResponse({ status: 404, description: 'Категория не найдена' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cotegorysService.remove(id);
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать подкатегорию', description: 'Требуется роль ADMIN' })
  @ApiBody({ type: CreateSubcategoryDto })
  @ApiResponse({ status: 201, description: 'Подкатегория создана' })
  @Post('sub')
  createSubcategory(@Body() dto: CreateSubcategoryDto) {
    return this.cotegorysService.createSubcategory(dto);
  }

  @ApiOperation({ summary: 'Получить подкатегории по id родителя' })
  @ApiParam({ name: 'parentId', description: 'ID родительской категории' })
  @ApiResponse({ status: 200, description: 'Список подкатегорий' })
  @Get(':parentId/subcategories')
  getSubcategories(@Param('parentId') parentId: string) {
    return this.cotegorysService.getSubcategories(parentId);
  }

  @Authorization(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить подкатегорию', description: 'Требуется роль ADMIN' })
  @ApiParam({ name: 'id', description: 'ID подкатегории' })
  @ApiResponse({ status: 200, description: 'Подкатегория удалена' })
  @Delete('sub/:id')
  removeSubcategory(@Param('id') id: string) {
    return this.cotegorysService.removeSubcategory(id);
  }
}
