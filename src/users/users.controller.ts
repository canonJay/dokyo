import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common'
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
  @Get('me')
  async getMe(@Authorized("id") userId: string) {
    return await this.usersService.findById(userId)
  }

  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 200, description: 'User created' })
  @ApiResponse({ status: 400, description: 'User not created' })
  @ApiBody({ type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users' })
  @ApiResponse({ status: 400, description: 'Users not found' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @Authorization()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 400, description: 'User not updated' })
  @ApiParam({ name: 'id', description: 'The id of the user' })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
    update( @Body() updateUserDto: UpdateUserDto, @Authorized("id") userId: string) {
    return this.usersService.update(updateUserDto, userId);
  }

  @ApiBearerAuth()
  @Authorization()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 400, description: 'User not deleted' })
  @ApiParam({ name: 'id', description: 'The id of the user' })
  @Delete('me')
  remove(@Authorized("id") userId: string) {
    return this.usersService.remove(userId);
  }
}
