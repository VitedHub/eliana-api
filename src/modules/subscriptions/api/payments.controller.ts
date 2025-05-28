import {
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateCheckoutSession } from '../application/usecases/create-checkout-session.usecase';
import { User } from '@/auth/api/decorators/user.decorator';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { HandlePaymentWebhook } from '../application/usecases/handle-webhook.usecase';
import { ProfessionalAuthGuard } from '@/auth/api/guards/profesional-auth.guard';
import { Public } from '@/auth/api/decorators/is-public.decorator';
import { RawBody } from '@/core/api/decorators/raw-body.decorator';
import { GetSubscriptionStatus } from '../application/usecases/get-subscription-status.usecase';
import { PaymentService } from '../application/services/payment.service';

@UseGuards(ProfessionalAuthGuard)
@Controller('payments')
export class PaymentsController {
  @Inject(CreateCheckoutSession)
  private createCheckoutUseCase: CreateCheckoutSession;
  @Inject(HandlePaymentWebhook)
  private handleWebhookUseCase: HandlePaymentWebhook;
  @Inject(GetSubscriptionStatus)
  private getSubscriptionStatusUseCase: GetSubscriptionStatus;

  @Inject(PaymentService)
  private paymentService: PaymentService;

  @Public()
  @Get('checkout-session')
  async createCheckoutSession(
    @User() professional: Professional,
    @Query('priceId') priceId: string,
  ) {
    const response = await this.createCheckoutUseCase.execute({
      professional,
      priceId,
    });

    return { url: response };
  }

  @Public()
  @Post('webhook')
  async handleWebhook(
    @RawBody() payload: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    await this.handleWebhookUseCase.execute({
      payload,
      signature,
    });
  }

  @Public()
  @Get('status')
  async getSubscriptionStatus(@User() professional: Professional) {
    const response = await this.paymentService.getSubsStatus(professional);

    return response;
  }
}
