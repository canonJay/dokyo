import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { CotegorysService } from './cotegorys.service'
import { CreateCotegoryDto } from './dto/create-cotegory.dto'
import { UpdateCotegoryDto } from './dto/update-cotegory.dto'

@Controller('cotegorys')
export class CotegorysController {
  constructor(private readonly cotegorysService: CotegorysService) {}

  @Authorization(Role.ADMIN)
  @ApiOperation({ summary: 'Create a category' })
  @ApiResponse({ status: 200, description: 'Category created' })
  @ApiResponse({ status: 400, description: 'Category not created' })
  @ApiBody({ type: CreateCotegoryDto })
  @Post()
  create(@Body() createCotegoryDto: CreateCotegoryDto) {
    return this.cotegorysService.create(createCotegoryDto);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories' })
  @ApiResponse({ status: 400, description: 'Categories not found' })
  @Get()
  findAll() {
    return this.cotegorysService.findAll();
  }

  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({ status: 200, description: 'Category' })
  @ApiResponse({ status: 400, description: 'Category not found' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cotegorysService.findOne(id);
  }

  @Authorization(Role.ADMIN)
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ status: 200, description: 'Category updated' })
  @ApiResponse({ status: 400, description: 'Category not updated' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @ApiBody({ type: UpdateCotegoryDto })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCotegoryDto: UpdateCotegoryDto) {
    return this.cotegorysService.update(id, updateCotegoryDto);
  }

  @Authorization(Role.SALLER)
  @ApiOperation({ summary: 'Add a product to a category' })
  @ApiResponse({ status: 200, description: 'Product added to category' })
  @ApiResponse({ status: 400, description: 'Product not added to category' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @ApiParam({ name: 'productId', description: 'The id of the product' })
  @Patch(':id/products/:productId')
  addProductToCategory(@Param('id') id: string, @Param('productId') productId: string) {
    return this.cotegorysService.addProductToCategory(id, productId);
  }

  @Authorization(Role.SALLER)
  @ApiOperation({ summary: 'Remove a product from a category' })
  @ApiResponse({ status: 200, description: 'Product removed from category' })
  @ApiResponse({ status: 400, description: 'Product not removed from category' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @ApiParam({ name: 'productId', description: 'The id of the product' })
  @Delete(':id/products/:productId')
  removeProductFromCategory(@Param('id') id: string, @Param('productId') productId: string) {
    return this.cotegorysService.removeProductFromCategory(id, productId);
  }

  @Authorization(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @ApiResponse({ status: 400, description: 'Category not deleted' })
  @ApiParam({ name: 'id', description: 'The id of the category' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cotegorysService.remove(id);
  }
}
