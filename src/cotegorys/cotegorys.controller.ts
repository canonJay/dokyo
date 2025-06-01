import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { CotegorysService } from './cotegorys.service'
import { CreateCotegoryDto } from './dto/create-cotegory.dto'
import { UpdateCotegoryDto } from './dto/update-cotegory.dto'

@Controller('cotegorys')
export class CotegorysController {
  constructor(private readonly cotegorysService: CotegorysService) {}

  @Post()
  create(@Body() createCotegoryDto: CreateCotegoryDto) {
    return this.cotegorysService.create(createCotegoryDto);
  }

  @Get()
  findAll() {
    return this.cotegorysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cotegorysService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCotegoryDto: UpdateCotegoryDto) {
    return this.cotegorysService.update(id, updateCotegoryDto);
  }

  @Patch(':id/products/:productId')
  addProductToCategory(@Param('id') id: string, @Param('productId') productId: string) {
    return this.cotegorysService.addProductToCategory(id, productId);
  }

  @Delete(':id/products/:productId')
  removeProductFromCategory(@Param('id') id: string, @Param('productId') productId: string) {
    return this.cotegorysService.removeProductFromCategory(id, productId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cotegorysService.remove(id);
  }
}
