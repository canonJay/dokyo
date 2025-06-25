import { BadRequestException, Injectable } from '@nestjs/common'
import { PaymentsService } from 'src/payments/payments.service'
import { PrismaService } from 'src/prisma.service'
import { ProductsService } from 'src/products/products.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStutusDto } from './dto/update-order.dto'

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService,
    private readonly paymets: PaymentsService,
    private readonly products: ProductsService
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    try {
      const products = await this.products.findManyByIds(createOrderDto.productsId)

      if (!Array.isArray(products)) {
        throw products 
      }

      if (products.length !== createOrderDto.productsId.length) {
        throw new Error('Некоторые продукты не найдены')
      }

      const order = await this.prisma.order.create({
        data: {
          userId: userId,
          products: {
            connect: createOrderDto.productsId.map(id => ({ id }))
          }
        },
        include: {
          products: true,
          user: true
        }
      })

      const orderPayment = await this.paymets.create(createOrderDto, order.id)

      const updatedOrder = await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentId: orderPayment.id
        },
        include: {
          products: true,
          payment: true,
          user: true
        }
      })

      return updatedOrder

    } catch (error) {
      throw new Error(`Ошибка при создании заказа: ${error.message}`)
    }
  }

  async findOrdersBySeller(sellerId: string) {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          products: {
            some: {
              userId: sellerId
            }
          }
        },
        include: {
          products: {
            where: {
              userId: sellerId
            }
          },
          payment: true,
          user: {
            select: {
              id: true,
              username: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return orders
    } catch (error) {
      throw new BadRequestException("Ошибка при получении заказов продавца")
    }
  }

  async findMyOriders(userId: string) {
    try{
      const orders = await this.prisma.order.findMany({
        where: {
          userId: userId
        },

      include: {
        payment: true,
        products: true
      }
      })

      return orders
    }catch(errr){
      return new BadRequestException("Пользователь не найден")
    }
  }

  async findById(id: string, userId?: string){
    try{
      const order = await this.prisma.order.findUnique({
        where: {
          id,
          userId: userId || null
        }
      })

      return order
    }catch(error){
      return new BadRequestException("Не найден заказ")
    }
  }

  async updateOrderStutus(orderId: string, dto: UpdateOrderStutusDto) {
    try{
      const order = await this.prisma.order.update({
        where: {
          id: orderId
        },
        data: {
          stutus: dto.stutus
        }
      })
    }
    catch(error){
      return new BadRequestException('Не удалось обновить статус')
    }
  }
}
