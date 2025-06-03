import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsString()
  userId: string

  @IsNotEmpty()
  @IsString()
  productId: string
}
