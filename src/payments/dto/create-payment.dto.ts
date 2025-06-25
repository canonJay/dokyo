export class CreatePaymentDto {}


export class CreateRefundDto {
  operation_id: string;
  amount: {
    value: string;
    currency: string;
  };
  description: string;
}

export class NotificationDto {
  type: string;
  event: string;
  signature: string;
  object: any;
}