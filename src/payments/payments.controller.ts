import { Body, Controller, Headers, Post } from '@nestjs/common'
import * as crypto from 'crypto'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { CreateRefundDto, NotificationDto } from './dto/create-payment.dto'
import { PaymentsService } from './payments.service'

@Controller('payments')
export class PaymentsController {
	constructor (private readonly payments: PaymentsService) {}

  @Post('refund')
	@Authorization(Role.SALLER)
	async refund(
    @Body() dto: CreateRefundDto,
    @Headers('idempotency-key') idempotencyKey: string
  ) {
    return this.payments.refund(dto, idempotencyKey);
  }

  @Post('webhook')
  async webhook(@Body() body: NotificationDto): Promise<void> {
    // Секретный ключ магазина (замените на ваш)
    const secret = process.env.PAYMENT_SECRET_KEY || 'your_secret_key';

    // Проверка подписи
    const expectedSignature = crypto
      .createHash('sha256')
      .update(body.object.id + secret)
      .digest('hex');

    if (body.signature !== expectedSignature) {
      // Можно залогировать попытку, но всегда возвращаем 200
      console.warn('Invalid signature in payment webhook');
      return;
    }

    // Обработка событий
    switch (body.event) {
      case 'payment.succeeded':
        // обработка успешного платежа
        await this.payments.handlePaymentSucceeded(body.object);
        break;
      case 'payment.canceled':
        await this.payments.handlePaymentCanceled(body.object);
        break;
      case 'refund.succeeded':
        await this.payments.handleRefundSucceeded(body.object);
        break;
      case 'refund.canceled':
        await this.payments.handleRefundCanceled(body.object);
        break;
      case 'payout.succeeded':
        await this.payments.handlePayoutSucceeded(body.object);
        break;
      case 'payout.canceled':
        await this.payments.handlePayoutCanceled(body.object);
        break;
      case 'detail.verified':
        await this.payments.handleDetailVerified(body.object);
        break;
      default:
        // Неизвестное событие — можно залогировать
        console.log('Unknown webhook event:', body.event);
    }
    // Всегда возвращаем 200 OK (NestJS по умолчанию)
  }
}