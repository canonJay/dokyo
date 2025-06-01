import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateReviewDto {

	@IsString()
	@IsNotEmpty()
	text: string

	@IsNumber()
	@IsNotEmpty()
	rating: number

	@IsString()
	@IsNotEmpty()
	productId: string
}
