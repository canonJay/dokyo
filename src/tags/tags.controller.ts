import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { CreateTagDto } from './dto/create-tag.dto'
import { UpdateTagDto } from './dto/update-tag.dto'
import { TagsService } from './tags.service'

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiOperation({ summary: 'Create a tag' })
  @ApiResponse({ status: 200, description: 'Tag created' })
  @ApiResponse({ status: 400, description: 'Tag not created' })
  @ApiBody({ type: CreateTagDto })
  @Post()
  @Authorization()
  @ApiBearerAuth()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @ApiOperation({ summary: 'Get all tags' })
  @ApiResponse({ status: 200, description: 'Tags' })
  @ApiResponse({ status: 400, description: 'Tags not found' })
  @Get()
  findAll() {
    return this.tagsService.findAll();
  }

  @ApiOperation({ summary: 'Get a tag by id' })
  @ApiResponse({ status: 200, description: 'Tag' })
  @ApiResponse({ status: 400, description: 'Tag not found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a tag' })
  @ApiResponse({ status: 200, description: 'Tag updated' })
  @ApiResponse({ status: 400, description: 'Tag not updated' })
  @ApiParam({ name: 'id', description: 'The id of the tag' })
  @ApiBody({ type: UpdateTagDto })
  @Patch(':id')
  @Authorization()
  update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @ApiOperation({ summary: 'Delete a tag' })
  @ApiResponse({ status: 200, description: 'Tag deleted' })
  @ApiResponse({ status: 400, description: 'Tag not deleted' })
  @ApiParam({ name: 'id', description: 'The id of the tag' })
  @Delete(':id')
  @Authorization()
  remove(@Param('id') id: string) {
    return this.tagsService.remove(id);
  }
}
