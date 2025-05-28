import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { PaymentService } from '@/subscriptions/application/services/payment.service';
import { CreateProfessionalSubscription } from '@/subscriptions/application/usecases/create-professional-subscriptions.usecase';
import { DeactivateProfessionalSubscription } from '@/subscriptions/application/usecases/deactivate-professional-subscription.usecase';
import { GetSubscriptionStatus } from '@/subscriptions/application/usecases/get-subscription-status.usecase';
import { UpdateProfessionalSubscription } from '@/subscriptions/application/usecases/update-professional-subscriptions.usecase';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentService implements PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(StripePaymentService.name);

  constructor(
    @Inject(UpdateProfessionalSubscription)
    private readonly updateProfessionalSubscriptionUseCase: UpdateProfessionalSubscription,
    @Inject(CreateProfessionalSubscription)
    private readonly createProfessionalSubscriptionUseCase: CreateProfessionalSubscription,
    @Inject(DeactivateProfessionalSubscription)
    private readonly deactivateProfessionalSubsUseCase: DeactivateProfessionalSubscription,
    @Inject(GetSubscriptionStatus)
    private readonly getSubscriptionStatusUseCase: GetSubscriptionStatus,
  ) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      this.logger.error('Missing Stripe URLs in environment variables');
      return null;
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-04-30.basil',
    });
  }

  async createCheckoutSession(
    professionalId: string,
    priceId: string,
  ): Promise<string | null> {
    try {
      const success_url = process.env.STRIPE_SUCCESS_URL;
      const cancel_url = process.env.STRIPE_CANCEL_URL;

      if (!success_url || !cancel_url) {
        this.logger.error('Missing Stripe URLs in environment variables');
        return null;
      }

      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card', 'boleto'],
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url,
        cancel_url,
        subscription_data: {
          metadata: {
            professionalId,
          },
        },
      });

      return session.url;
    } catch (err) {
      this.logger.error(
        'Error creating Stripe checkout session',
        err instanceof Error ? err.stack : String(err),
      );
      return null;
    }
  }

  async handleWebhook(
    payload: string | Buffer,
    signature: string,
  ): Promise<void> {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        this.logger.error(
          'Missing Stripe Webhook secret in environment variables',
        );
        return;
      }

      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      switch (event.type) {
        case 'invoice.payment_succeeded':
          await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription,
          );
          break;
        default:
          this.logger.warn(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      this.logger.error(
        'Webhook handling failed',
        err instanceof Error ? err.stack : String(err),
      );
    }
  }

  async getSubsStatus(professional: Professional) {
    const subscription = await this.getSubscriptionStatusUseCase.execute({
      professional,
    });

    if (!subscription.stripeSubscriptionId || !subscription.isActive) {
      return {
        isActive: false,
      };
    }

    try {
      const stripeSubscription = await this.stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId,
      );

      console.log(stripeSubscription);
      return {
        active: stripeSubscription.status === 'active',
        stripeSubscriptionId: stripeSubscription.id,
        currentPeriodEnd: new Date(
          stripeSubscription.billing_cycle_anchor * 1000,
        ),
      };
    } catch (err) {
      this.logger.error('Failed to fetch Stripe subscription', err);
      return { active: false };
    }
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
    const subscriptionId = invoice.parent.subscription_details.subscription;

    if (!subscriptionId) {
      this.logger.error('[handleInvoicePaid]: Missing subscription ID');
      return;
    }

    const subscription = await this.stripe.subscriptions.retrieve(
      subscriptionId as string,
    );

    const professionalId = subscription.metadata.professionalId;
    const priceId = subscription.items.data[0].price.id;

    try {
      await this.updateProfessionalSubscriptionUseCase.execute({
        professionalId,
        stripeSubscription: subscriptionId as string,
        stripePriceId: priceId,
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        await this.createProfessionalSubscriptionUseCase.execute({
          professionalId,
          stripeSubscriptionId: subscriptionId as string,
          stripePriceId: priceId,
        });
      } else {
        this.logger.error('Error updating subscription', err);
        throw err;
      }
    }
  }

  private async handleSubscriptionDeleted(
    subscription: Stripe.Subscription,
  ): Promise<void> {
    try {
      await this.deactivateProfessionalSubsUseCase.execute({
        stripeSubscriptionId: subscription.id,
      });
    } catch (err) {
      if (err instanceof NotFoundException) {
        this.logger.warn(
          `[StripeService]: Subscription not found for ID: ${subscription.id}`,
        );
      } else {
        throw err;
      }
    }
  }
}
