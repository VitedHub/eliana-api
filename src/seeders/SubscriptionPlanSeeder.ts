import { SubscriptionPlan } from '@/subscriptions/domain/entities/subscription-plan.entity';
import { BillingCycle } from '@/subscriptions/domain/enums/billing-cycle.enum';
import { Seeder } from '@mikro-orm/seeder';
import { randomUUID } from 'crypto';

export class SubscriptionPlanSeeder extends Seeder {
  async run(em: Parameters<Seeder['run']>[0]): Promise<void> {
    const plans: SubscriptionPlan[] = [
      {
        id: randomUUID(),
        name: 'Free',
        price: 0,
        stripePriceId: null,
        maxEstablishments: 0,
        maxProfessionalsPerEstablishment: 0,
        billingCycle: null,
      },
      {
        id: randomUUID(),
        name: 'Lifetime',
        price: 0,
        stripePriceId: null,
        maxEstablishments: 9999,
        maxProfessionalsPerEstablishment: 9999,
        billingCycle: null,
      },
      {
        id: randomUUID(),
        name: 'Basic_Monthly',
        price: 8000,
        stripePriceId: process.env.STRIPE_BASIC_MONTHLY_PRICE_ID,
        maxEstablishments: 3,
        maxProfessionalsPerEstablishment: null,
        billingCycle: BillingCycle.MONTHLY,
      },
      {
        id: randomUUID(),
        name: 'Basic-Annual',
        price: 8000,
        stripePriceId: process.env.STRIPE_BASIC_YEARLY_PRICE_ID,
        maxEstablishments: 3,
        maxProfessionalsPerEstablishment: null,
        billingCycle: BillingCycle.YEARLY,
      },
    ];

    for (const plan of plans) {
      const exists = await em.findOne(SubscriptionPlan, { name: plan.name });
      if (!exists) {
        em.create(SubscriptionPlan, plan);
      }
    }
  }
}
