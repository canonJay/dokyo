import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCotegoryDto {
	@IsString()
	@IsNotEmpty()
	name: string

	@IsArray()
	@IsOptional()
	@IsString({ each: true })
	products: string[]
}
