import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger'
import { User } from 'prisma/generated/prisma'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @ApiBearerAuth()
  @Get('me')
  getMe(@CurrentUser() user: User) {
    return user
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
  @Auth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 400, description: 'User not updated' })
  @ApiParam({ name: 'id', description: 'The id of the user' })
  @ApiBody({ type: UpdateUserDto })
  @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @CurrentUser() user: User) {
    return this.usersService.update(id, updateUserDto, user.id);
  }

  @ApiBearerAuth()
  @Auth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  @ApiResponse({ status: 400, description: 'User not deleted' })
  @ApiParam({ name: 'id', description: 'The id of the user' })
  @Delete('me')
  remove(@CurrentUser() user: User) {
    return this.usersService.remove(user.id);
  }
}
