import { forwardRef, Module } from '@nestjs/common';
import { PaymentsController } from './api/payments.controller';
import { PaymentService } from './application/services/payment.service';
import { StripePaymentService } from './infra/services/stripe-payment.service';
import { ProfessionalModule } from '@/professionals/professionals.module';
import { IProfessionalSubscriptionRepository } from './application/repositories/professional-subscription.repository';
import { ProfessionalSubscriptionPgRepository } from './data/repositories/mikro-orm/professional-subscription.pg.repository';
import { ISubscriptionPlanRepository } from './application/repositories/subscription-plan.repository';
import { SubscriptionPlanPgRepository } from './data/repositories/mikro-orm/subscription-plan.pg.repository';
import { CreateCheckoutSession } from './application/usecases/create-checkout-session.usecase';
import { HandlePaymentWebhook } from './application/usecases/handle-webhook.usecase';
import { UpdateProfessionalSubscription } from './application/usecases/update-professional-subscriptions.usecase';
import { DeactivateProfessionalSubscription } from './application/usecases/deactivate-professional-subscription.usecase';
import { CreateProfessionalSubscription } from './application/usecases/create-professional-subscriptions.usecase';
import { AuthModule } from '@/auth/auth.module';
import { GetSubscriptionStatus } from './application/usecases/get-subscription-status.usecase';

@Module({
  imports: [ProfessionalModule, forwardRef(() => AuthModule)],
  controllers: [PaymentsController],
  providers: [
    {
      provide: PaymentService,
      useClass: StripePaymentService,
    },
    {
      provide: IProfessionalSubscriptionRepository,
      useClass: ProfessionalSubscriptionPgRepository,
    },
    {
      provide: ISubscriptionPlanRepository,
      useClass: SubscriptionPlanPgRepository,
    },
    CreateCheckoutSession,
    HandlePaymentWebhook,
    CreateProfessionalSubscription,
    UpdateProfessionalSubscription,
    DeactivateProfessionalSubscription,
    GetSubscriptionStatus,
  ],
  exports: [IProfessionalSubscriptionRepository, ISubscriptionPlanRepository],
})
export class SubscriptionModule {}
