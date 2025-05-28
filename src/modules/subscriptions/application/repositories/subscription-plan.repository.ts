import { SubscriptionPlan } from '@/subscriptions/domain/entities/subscription-plan.entity';

export abstract class ISubscriptionPlanRepository {
  abstract findByPriceId(
    data: FindOneSubscriptionPlanInput,
  ): Promise<SubscriptionPlan | null>;
  abstract findByName(name: string): Promise<SubscriptionPlan | null>;
}

export type FindOneSubscriptionPlanInput = {
  stripePriceId: string;
};
