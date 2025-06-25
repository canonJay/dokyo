import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStutusDto } from './dto/update-order.dto'
import { OrdersService } from './orders.service'

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Authorization()
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Authorized("id") userId: string) {
    return await this.ordersService.create(createOrderDto, userId);
  }

  @Authorization(Role.SALLER)
  @Get("findOrdersBySeller")
  async findOrdersBySeller(@Authorized("id") sellerId: string) {
    return await this.ordersService.findOrdersBySeller(sellerId)
  }

  @Authorization(Role.SALLER)
  @Get("findOrderBySeller/:id")
  async findOrderBySeller(@Param("id") orderId: string) {
    return await this.ordersService.findById(orderId)
  }

  @Authorization(Role.SALLER)
  @Patch("updateOrderStutus/:id")
  async updateOrderStutus(@Param("id") orderId: string, dto: UpdateOrderStutusDto) {
    return await this.ordersService.updateOrderStutus(orderId, dto)
  }
}
