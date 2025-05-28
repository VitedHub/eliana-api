import {
  FindOneSubscriptionPlanInput,
  ISubscriptionPlanRepository,
} from '@/subscriptions/application/repositories/subscription-plan.repository';
import { SubscriptionPlan } from '@/subscriptions/domain/entities/subscription-plan.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class SubscriptionPlanPgRepository
  implements ISubscriptionPlanRepository
{
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  findByPriceId(
    data: FindOneSubscriptionPlanInput,
  ): Promise<SubscriptionPlan | null> {
    return this.entityManager.findOne(SubscriptionPlan, {
      stripePriceId: data.stripePriceId,
    });
  }

  findByName(name: string): Promise<SubscriptionPlan | null> {
    return this.entityManager.findOne(SubscriptionPlan, {
      name,
    });
  }
}
