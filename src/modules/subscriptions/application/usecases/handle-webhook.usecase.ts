import { Inject, Injectable } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';

export type CreateCheckoutSessionInputs = {
  payload: string | Buffer;
  signature: string;
};

@Injectable()
export class HandlePaymentWebhook {
  @Inject(PaymentService)
  private paymentService: PaymentService;

  async execute(data: CreateCheckoutSessionInputs) {
    return this.paymentService.handleWebhook(data.payload, data.signature);
  }
}
