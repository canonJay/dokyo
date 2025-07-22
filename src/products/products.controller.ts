import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto, UpdateProductDtoForApprove, UpdateStutusDto } from './dto/update-product.dto'
import { ProductsService } from './products.service'
import { FastifyRequest } from 'fastify'

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Authorization(Role.SALLER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать продукт' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Продукт создан', schema: { example: { id: '1', title: 'Product 1', price: 100, description: 'Product 1 description', images: ['image1.jpg'], categoryIds: ['cat1'], tagIds: ['tag1'] } } })
  @ApiResponse({ status: 400, description: 'Ошибка создания продукта' })
  @Post()
  async  create(@Body() createProductDto: CreateProductDto, @Authorized("id") userId: string, @Req() request: FastifyRequest,
) {

    const file = await request.file();
    let files = [] as Array<{ buffer: Buffer; filename: string; mimetype: string }>;
    
    if (file) {
      files = [{
        buffer: await file.toBuffer(),
        filename: file.filename,
        mimetype: file.mimetype,
      }];
    }


    return this.productsService.create(createProductDto, userId, files);
}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все продукты (по статусу или все)' })
  @ApiResponse({ status: 200, description: 'Список продуктов', schema: { example: [{ id: '1', title: 'Product 1', price: 100, description: 'Product 1 description', images: ['image1.jpg'], categoryIds: ['cat1'], tagIds: ['tag1'] }] } })
  @Get('')
  findAll(@Query('status') status?: string) {
    return this.productsService.findAll(status);
  }

  @Authorization(Role.MODER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить все продукты на модерации' })
  @ApiResponse({ status: 200, description: 'Список продуктов на модерации', schema: { example: [{ id: '1', title: 'Product 1', stutus: 'PENDING' }] } })
  @Get('/getAllModerationProducts')
  async getAllModerationProducts() {
    return await this.productsService.getAllModerationProducts()
  }

  @Authorization(Role.MODER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить продукт на модерации по id' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Продукт найден', schema: { example: { id: '1', title: 'Product 1', stutus: 'PENDING' } } })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Get('/getModerationProduct/:id')
  async getModerationProductById(@Param("id") id: string) {
    return await this.productsService.getModerationProductById(id)
  }

  @Authorization(Role.MODER, Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить статус продукта по id (модератор/админ)' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiBody({ type: UpdateStutusDto })
  @ApiResponse({ status: 200, description: 'Статус продукта обновлён', schema: { example: { id: '1', stutus: 'APPROVED' } } })
  @ApiResponse({ status: 400, description: 'Ошибка обновления статуса' })
  @Patch('updateStutusById/:id')
  async updateStutusById(@Param("id") id: string, @Body() updateStutusDto: UpdateStutusDto){ 
    return await this.productsService.updateStutusById(id, updateStutusDto)
  }

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Пользователь отправляет продукт на модерацию' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiBody({ type: UpdateProductDtoForApprove })
  @ApiResponse({ status: 200, description: 'Продукт отправлен на модерацию', schema: { example: { id: '1', stutus: 'PENDING' } } })
  @ApiResponse({ status: 400, description: 'Ошибка отправки на модерацию' })
  @Patch('updateStutusByIdForSaller/:id')
  async updateStutusByIdForSaller(@Param('id') id: string, @Authorized('id') userId: string){ 
    return await this.productsService.updateStutusByIdForSaller(id, userId)
  }
  
  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить продукты по продавцу' })
  @ApiParam({ name: 'id', description: 'ID продавца' })
  @ApiResponse({ status: 200, description: 'Список продуктов продавца', schema: { example: [{ id: '1', title: 'Product 1', price: 100 }] } })
  @Get('seller/:id')
  findBySellerId(@Param('id') id: string) {
    return this.productsService.findBySellerId(id);
  } 

  @ApiOperation({ summary: 'Получить продукт по id' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Продукт найден', schema: { example: { id: '1', title: 'Product 1', price: 100 } } })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить продукт' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Продукт обновлён', schema: { example: { id: '1', title: 'Product 1', price: 100 } } })
  @ApiResponse({ status: 400, description: 'Ошибка обновления продукта' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,  @Authorized("id") userId: string, @Req() req: FastifyRequest) {

    const file = await req.file();

    let files = [] as Array<{ buffer: Buffer; filename: string; mimetype: string }>;
    
    if (file) {
      files = [{
        buffer: await file.toBuffer(),
        filename: file.filename,
        mimetype: file.mimetype,
      }];
    }
    return this.productsService.update(id, updateProductDto, userId, files);
  }

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить продукт' })
  @ApiParam({ name: 'id', description: 'ID продукта' })
  @ApiResponse({ status: 200, description: 'Продукт удалён', schema: { example: true } })
  @ApiResponse({ status: 404, description: 'Продукт не найден' })
  @Delete(':id')
  remove(@Param('id') id: string,  @Authorized("id") userId: string) {
    return this.productsService.remove(id, userId);
  }
}
