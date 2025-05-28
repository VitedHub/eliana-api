import { Professional } from '@/professionals/domain/entities/professionals.entity';

export abstract class PaymentService {
  abstract createCheckoutSession(
    professionalId: string,
    priceId: string,
  ): Promise<string>;

  abstract handleWebhook(
    payload: string | Buffer,
    signature: string,
  ): Promise<void>;

  abstract getSubsStatus(professional: Professional): Promise<any>;
}
