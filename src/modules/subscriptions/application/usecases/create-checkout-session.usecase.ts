import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { Professional } from '@/professionals/domain/entities/professionals.entity';

export type CreateCheckoutSessionInputs = {
  professional: Professional;
  priceId: string;
};

@Injectable()
export class CreateCheckoutSession {
  @Inject(PaymentService)
  private paymentService: PaymentService;

  async execute(data: CreateCheckoutSessionInputs): Promise<string> {
    if (!data.professional) {
      throw new UnauthorizedException(
        'You must be logged in to use this feature',
      );
    }

    return this.paymentService.createCheckoutSession(
      data.professional.id,
      data.priceId,
    );
  }
}
