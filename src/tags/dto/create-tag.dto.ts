import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateTagDto {
  @ApiProperty({
    description: 'The name of the tag',
    example: 'Tag 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The product id of the tag',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  productId: string[]
}
