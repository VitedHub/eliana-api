import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { BillingCycle } from '../enums/billing-cycle.enum';

@Entity({ tableName: 'subscription_plan' })
export class SubscriptionPlan {
  @PrimaryKey({ name: 'id', type: 'uuid', primary: true })
  id!: string;

  @Property({ name: 'name', type: 'varchar', length: 255 })
  name!: string;

  @Property({ name: 'price' })
  price!: number;

  @Property({
    name: 'stripe_price_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  stripePriceId: string;

  @Property({ name: 'max_establishments', nullable: true, type: 'int' })
  maxEstablishments?: number;

  @Property({
    name: 'max_professionals_per_establishment',
    nullable: true,
    type: 'int',
  })
  maxProfessionalsPerEstablishment?: number;

  @Property({
    name: 'billing_cycle',
    nullable: true,
    type: 'varchar',
    length: 255,
  })
  billingCycle?: BillingCycle;
}
