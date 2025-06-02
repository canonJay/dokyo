import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateProductDto {

	@ApiProperty({
		description: 'The title of the product',
		example: 'Product 1',
	})
	@IsString()
	@IsNotEmpty()
	title: string

	@ApiProperty({
		description: 'The description of the product',
		example: 'Product 1 description',
	})
	@IsString()
	@IsNotEmpty()
	description: string

	@ApiProperty({
		description: 'The price of the product',
		example: 100,
	})
	@IsNumber()
	@IsNotEmpty()
	price: number

	@ApiProperty({
		description: 'The images of the product',
		example: ['image1.jpg', 'image2.jpg'],
	})
	@IsArray()
	@IsString({ each: true })
	images: string[]

	@ApiProperty({
		description: 'The category ids of the product',
		example: ['1', '2'],
	})
	@IsArray()
	@IsString({ each: true })
	categoryIds: string[]

	@ApiProperty({
		description: 'The tag ids of the product',
		example: ['1', '2'],
	})
	@IsArray()
	@IsString({ each: true })
	tagIds: string[]
}
