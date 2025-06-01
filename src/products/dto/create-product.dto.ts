import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateProductDto {

	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsNotEmpty()
	description: string

	@IsNumber()
	@IsNotEmpty()
	price: number

	@IsArray()
	@IsString({ each: true })
	images: string[]

	@IsArray()
	@IsString({ each: true })
	categoryIds: string[]

	@IsArray()
	@IsString({ each: true })
	tagIds: string[]
}
