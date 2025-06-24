import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto, UpdateProductDtoForApprove, UpdateStutusDto } from './dto/update-product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 200, description: 'Product created' })
  @ApiResponse({ status: 400, description: 'Product not created' })
  @ApiBody({ type: CreateProductDto })
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Authorized("id") userId: string) {
    return this.productsService.create(createProductDto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products' })
  @ApiResponse({ status: 400, description: 'Products not found' })
  @Get('')
  findAll(@Query('status') status?: string) {
    return this.productsService.findAll(status);
  }

  @Authorization(Role.MODER, Role.ADMIN)
  @Get('/getAllModerationProducts')
  async getAllModerationProducts() {
    return await this.productsService.getAllModerationProducts()
  }

  @Authorization(Role.MODER, Role.ADMIN)
  @Get('/getModerationProduct/:id')
  async getModerationProductById(@Param("id") id: string) {
    return await this.productsService.getModerationProductById(id)
  }

  @Authorization(Role.MODER, Role.ADMIN)
  @Patch("updateStutusById/:id")
  async updateStutusById(@Param("id") id: string, @Body() updateStutusDto: UpdateStutusDto){ 
    return await this.productsService.updateStutusById(id, updateStutusDto)
  }

  @Authorization(Role.USER)
  @Patch("updateStutusByIdForUser/:id")
  async updateStutusByIdForUser(@Param("id") id: string, @Body() updateProductDtoForApprove: UpdateProductDtoForApprove){ 
    return await this.productsService.updateStutusByIdForUser(id, updateProductDtoForApprove)
  }
  
  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a product by seller id' })
  @ApiResponse({ status: 200, description: 'Product' })
  @ApiResponse({ status: 400, description: 'Product not found' })
  @ApiParam({ name: 'id', description: 'The id of the seller' })
  @Get('seller/:id')
  findBySellerId(@Param('id') id: string) {
    return this.productsService.findBySellerId(id);
  } 

  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ status: 200, description: 'Product' })
  @ApiResponse({ status: 400, description: 'Product not found' })
  @ApiParam({ name: 'id', description: 'The id of the product' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated' })
  @ApiResponse({ status: 400, description: 'Product not updated' })
  @ApiParam({ name: 'id', description: 'The id of the product' })
  @ApiBody({ type: UpdateProductDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto,  @Authorized("id") userId: string) {
    return this.productsService.update(id, updateProductDto, userId);
  }

  @Authorization(Role.SALLER)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 400, description: 'Product not deleted' })
  @ApiParam({ name: 'id', description: 'The id of the product' })
  @Delete(':id')
  remove(@Param('id') id: string,  @Authorized("id") userId: string) {
    return this.productsService.remove(id, userId);
  }
}
