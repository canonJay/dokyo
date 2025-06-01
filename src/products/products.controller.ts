import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { User } from 'prisma/generated/prisma'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductsService } from './products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Auth()
  @Post()
  create(@Body() createProductDto: CreateProductDto, @CurrentUser() user: User) {
    return this.productsService.create(createProductDto, user.id);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Auth()
  @Get('seller/:id')
  findBySellerId(@Param('id') id: string) {
    return this.productsService.findBySellerId(id);
  } 

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Auth()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto, @CurrentUser() user: User) {
    return this.productsService.update(id, updateProductDto, user.id);
  }

  @Auth()
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.productsService.remove(id, user.id);
  }
}
