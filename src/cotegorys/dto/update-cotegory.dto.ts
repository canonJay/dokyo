import { PartialType } from '@nestjs/mapped-types'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateCotegoryDto } from './create-cotegory.dto'

export class UpdateCotegoryDto extends PartialType(CreateCotegoryDto) {
	@ApiProperty({
		description: 'The name of the category',
		example: 'Electronics',
	})
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({
		description: 'The products of the category',
	})
	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	products: string[]	
}
