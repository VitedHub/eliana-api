import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { ProfessionalSubscription } from '../entities/professional-subscription.entity';
import { randomUUID } from 'crypto';

export class ProfessionalSubscriptionBuilder {
  static create(data: ProfessionalSubscriptionData): ProfessionalSubscription {
    const newSubscription = new ProfessionalSubscription();
    newSubscription.id = data.id ?? randomUUID();
    newSubscription.professional = data.professional;
    newSubscription.subscriptionPlan = data.subscriptionPlan;
    newSubscription.stripeSubscriptionId = data.stripeSubscriptionId;
    newSubscription.startDate = data.startDate ?? new Date();
    newSubscription.isActive = true;
    newSubscription.endDate =
      data.endDate ?? this.calculateEndDate(data.subscriptionPlan.billingCycle);

    return newSubscription;
  }

  static isExpired(subscription: ProfessionalSubscription): boolean {
    return subscription.endDate ? subscription.endDate < new Date() : false;
  }

  static update(
    subscription: ProfessionalSubscription,
    data: Partial<Omit<ProfessionalSubscriptionData, 'professional'>>,
  ): ProfessionalSubscription {
    if (data.subscriptionPlan) {
      subscription.subscriptionPlan = data.subscriptionPlan;
      subscription.endDate = this.calculateEndDate(
        data.subscriptionPlan.billingCycle,
      );
    }

    if (data.stripeSubscriptionId) {
      subscription.stripeSubscriptionId = data.stripeSubscriptionId;
    }

    if (data.startDate) {
      subscription.startDate = data.startDate;
    }

    if (data.endDate) {
      subscription.endDate = data.endDate;
    }

    subscription.isActive = true;

    return subscription;
  }

  private static calculateEndDate(billingCycle: string): Date {
    return billingCycle === 'yearly'
      ? new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      : new Date(new Date().setMonth(new Date().getMonth() + 1));
  }
}

interface ProfessionalSubscriptionData {
  id?: string;
  professional: Professional;
  subscriptionPlan: SubscriptionPlan;
  stripeSubscriptionId?: string;
  startDate?: Date;
  endDate?: Date;
}
