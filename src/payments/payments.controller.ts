import { Body, Controller, Headers, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import * as crypto from 'crypto'
import { Role } from 'prisma/generated/prisma'
import { Authorization } from 'src/auth/decorators/auth.decorator'
import { CreateOrderDto } from 'src/orders/dto/create-order.dto'
import { CreateRefundDto, NotificationDto } from './dto/create-payment.dto'
import { PaymentsService } from './payments.service'

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
	constructor (private readonly payments: PaymentsService) {}

  @Post('create')
  @Authorization()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Создать платёж для заказа' })
  @ApiBody({ type: CreateOrderDto })
  @ApiResponse({ status: 201, description: 'Платёж успешно создан', schema: { example: { id: '...', status: 'PENDING', amount: 1000, confirmation: { type: 'redirect', return_url: 'https://...' } } } })
  @ApiResponse({ status: 400, description: 'Ошибка создания платежа' })
  async create(@Body() dto: CreateOrderDto): Promise<any> {
    // orderId должен быть уникальным, например, можно сгенерировать UUID или получить из dto, если есть
    // Здесь для примера используем productsId.join('-') как orderId (лучше использовать реальный id заказа)
    const orderId = dto.productsId.join('-') + '-' + Date.now();
    return this.payments.create(dto, orderId);
  }

  @Post('refund')
	@Authorization(Role.SALLER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Запросить возврат средств (refund)' })
  @ApiBody({ type: CreateRefundDto })
  @ApiHeader({ name: 'idempotency-key', description: 'Ключ идемпотентности для предотвращения повторных запросов', required: true })
  @ApiResponse({ status: 200, description: 'Возврат успешно инициирован', schema: { example: { id: '...', status: 'PENDING', amount: 1000 } } })
  @ApiResponse({ status: 400, description: 'Ошибка возврата средств' })
	async refund(
    @Body() dto: CreateRefundDto,
    @Headers('idempotency-key') idempotencyKey: string
  ) {
    return this.payments.refund(dto, idempotencyKey);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook для платёжной системы (обработка событий оплаты, возврата и т.д.)' })
  @ApiBody({ type: NotificationDto })
  @ApiResponse({ status: 200, description: 'Webhook обработан (всегда 200 OK)' })
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