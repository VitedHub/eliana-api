import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { SubscriptionPlan } from './subscription-plan.entity';

@Entity({ tableName: 'professional_subscription' })
export class ProfessionalSubscription {
  @PrimaryKey({ name: 'id', type: 'uuid', primary: true })
  id!: string;

  @ManyToOne(() => Professional, { joinColumn: 'professional_id' })
  professional!: Professional;

  @ManyToOne(() => SubscriptionPlan, {
    joinColumn: 'subscription_plan_id',
    nullable: false,
  })
  subscriptionPlan!: SubscriptionPlan;

  @Property({
    name: 'stripe_subscription_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  stripeSubscriptionId?: string;

  @Property({
    name: 'start_date',
    type: 'timestamp with time zone',
    nullable: false,
  })
  startDate!: Date;

  @Property({
    name: 'end_date',
    type: 'timestamp with time zone',
    nullable: true,
  })
  endDate?: Date;

  @Property({
    name: 'is_active',
    type: 'boolean',
    nullable: false,
  })
  isActive!: boolean;

  @Property({
    name: 'created_at',
    type: 'timestamp with time zone',
    nullable: false,
    onCreate: () => new Date(),
  })
  createdAt: Date = new Date();
}
