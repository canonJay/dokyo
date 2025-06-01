import { PartialType } from '@nestjs/mapped-types'
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { CreateCotegoryDto } from './create-cotegory.dto'

export class UpdateCotegoryDto extends PartialType(CreateCotegoryDto) {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	products: string[]	
}
