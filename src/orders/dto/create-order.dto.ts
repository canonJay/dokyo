import { ArrayMinSize, IsArray, IsString, IsUrl } from 'class-validator'
import { SettlementMethod } from 'prisma/generated/prisma'

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  productsId: string[]

	@IsString()
	settlement_method: SettlementMethod

  @IsString()
  @IsUrl()
  return_url : string
}
