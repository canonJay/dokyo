import { PartialType } from '@nestjs/mapped-types'
import { IsEmail, IsOptional, IsString, Min } from 'class-validator'
import { CreateUserDto } from './create-user.dto'

export class UpdateUserDto extends PartialType(CreateUserDto) {
}

export class UpdateAdminUserDto {
	
	@IsOptional()
	@IsString()
	@Min(4)
	username: string
	
	@IsOptional()
	@IsEmail()
	email: string
}