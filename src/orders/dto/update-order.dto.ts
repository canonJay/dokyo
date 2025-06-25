import { PartialType } from '@nestjs/swagger'
import { OrderStutus } from 'prisma/generated/prisma'
import { CreateOrderDto } from './create-order.dto'

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export class UpdateOrderStutusDto{
	stutus: OrderStutus
}
