import { HttpService } from '@nestjs/axios'
import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { CreateOrderDto } from 'src/orders/dto/create-order.dto'
import { PrismaService } from 'src/prisma.service'
import { CreateRefundDto } from './dto/create-payment.dto'

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService, private readonly httpService: HttpService, configService: ConfigService) {}

  URL = 'https://tome.ge/api/v1'

  
  async create(dto: CreateOrderDto, orderId: string){
    const totalPrice = await this.getTotalPrice(dto.productsId)

    const username = process.env.TOME_STORE_ID 
    const password = process.env.TOME_SECRET_KEY

    if(!username || !password) {
      return new BadGatewayException("Нет доступа к платёжной системе")
    }

    const PaymentData = {
      amount: {
        value: totalPrice,
        currency: "RUB",
      },
      customer: {
        settlement_method: dto.settlement_method.toLowerCase(),
      },
      confirmation: {
        type: 'redirect',
        return_url: dto.return_url,
      },
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.URL, PaymentData, {
          auth: {
            username,
            password,
          },
          headers: {
            'Idempotency-Key': orderId,
            'Content-Type': 'application/json',
          },
        })
      )
      return response.data
    }
    catch(error){
      return new BadRequestException(error)
    }
  }

  async refund(dto: CreateRefundDto, idempotencyKey: string){
    const username = process.env.TOME_STORE_ID;
    const password = process.env.TOME_SECRET_KEY;

    if (!username || !password) {
      throw new BadGatewayException('Нет доступа к платёжной системе');
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.URL}/refunds`,
          dto,
          {
            auth: { username, password },
            headers: {
              'Idempotency-Key': idempotencyKey,
              'Content-Type': 'application/json',
            },
          }
        )
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error?.response?.data || error.message);
    }
  }

  async handlePaymentSucceeded(object: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: object.id },
      include: {
        order: true
      }
    });

    if (!payment) {
      return;
    }

    await this.prisma.payment.update({
      where: { id: object.id },
      data: { status: 'SUCCESSDED' },
    });

    if (payment.order) {
      await this.prisma.order.update({
        where: { id: payment.order.id },
        data: { stutus: 'CONFIRMED' },
      });
    }
  }

  async handlePaymentCanceled(object: any) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: object.id },
      include: {
        order: true
      }
    });

    if (!payment) {
      return;
    }

    await this.prisma.payment.update({
      where: { id: object.id },
      data: { status: 'CANCELED' },
    });

    if (payment.order) {
      await this.prisma.order.update({
        where: { id: payment.order.id },
        data: { stutus: 'CANCELLED' },
      });
    }
  }

  async findAll() {
    try{
      const payments =await this.prisma.payment.findMany()
    }catch(error){ 
      return new BadRequestException()
    }
  }

  async findOne(id: string) {
    try{
      const payments =await this.prisma.payment.findUnique({
        where: {
          id
        }
      })
    }catch(error){ 
      return new BadRequestException()
    }
  }

  async handleRefundSucceeded(object: any) {
    // Если возвраты реализованы как отдельная сущность — обновить её
    // Если нет — можно обновить статус заказа/платежа или просто залогировать
    // Например:
    // await this.prisma.payment.update({ ... });
  }

  async handleRefundCanceled(object: any) {
    // Аналогично handleRefundSucceeded
  }

  async handlePayoutSucceeded(object: any) {
    // Реализуйте по необходимости
  }

  async handlePayoutCanceled(object: any) {
    // Реализуйте по необходимости
  }

  async handleDetailVerified(object: any) {
    // Реализуйте по необходимости
  }

  private async getTotalPrice(productsId: string[]): Promise<number> {
    const result = await this.prisma.product.aggregate({
      where: {
        id: {
          in: productsId
        }
      },
      _sum: {
        price: true
      }
    })

    return result._sum.price || 0
  }
}
