import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { TagsService } from './tags.service'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @Auth()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @Patch(':id')
  @Auth()
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @Delete(':id')
  @Auth()
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
