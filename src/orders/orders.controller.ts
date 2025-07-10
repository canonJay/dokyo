import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { Authorized } from 'src/auth/decorators/authorized.decorator'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStutusDto } from './dto/update-order.dto'
import { OrdersService } from './orders.service'

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать заказ' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Заказ создан', schema: { example: { id: '...', products: [], payment: {}, user: {} } } })
  @ApiResponse({ status: 400, description: 'Ошибка при создании заказа' })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Authorized("id") userId: string) {
    return await this.ordersService.create(createOrderDto, userId);
  }

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить заказы продавца' })
  @ApiResponse({ status: 200, description: 'Список заказов продавца', schema: { example: [{ id: '...', products: [], payment: {}, user: {} }] } })
  @ApiResponse({ status: 400, description: 'Ошибка при получении заказов продавца' })
  @Get('findOrdersBySeller')
  async findOrdersBySeller(@Authorized("id") sellerId: string) {
    return await this.ordersService.findOrdersBySeller(sellerId)
  }

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить заказ продавца по id' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiResponse({ status: 200, description: 'Заказ найден', schema: { example: { id: '...', products: [], payment: {}, user: {} } } })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @Get('findOrderBySeller/:id')
  async findOrderBySeller(@Param('id') orderId: string) {
    return await this.ordersService.findById(orderId)
  }

  @Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить статус заказа' })
  @ApiParam({ name: 'id', description: 'ID заказа' })
  @ApiBody({ type: UpdateOrderStutusDto })
  @ApiResponse({ status: 200, description: 'Статус заказа обновлён', schema: { example: { id: '...', stutus: 'CONFIRMED' } } })
  @ApiResponse({ status: 400, description: 'Не удалось обновить статус' })
  @Patch('updateOrderStutus/:id')
  async updateOrderStutus(@Param('id') orderId: string, @Body() dto: UpdateOrderStutusDto) {
    return await this.ordersService.updateOrderStutus(orderId, dto)
  }
}
