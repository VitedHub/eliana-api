import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { IProfessionalSubscriptionRepository } from '../repositories/professional-subscription.repository';
import { ISubscriptionPlanRepository } from '../repositories/subscription-plan.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProfessionalSubscriptionBuilder } from '@/subscriptions/domain/builders/professional-subscription.builder';

export type CreateProfessionalSubscriptionInput = {
  professionalId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
};

@Injectable()
export class CreateProfessionalSubscription {
  @Inject(IProfessionalRepository)
  private professionalRepo: IProfessionalRepository;
  @Inject(ISubscriptionPlanRepository)
  private subsPlanRepo: ISubscriptionPlanRepository;
  @Inject(IProfessionalSubscriptionRepository)
  private professionalSubsRepo: IProfessionalSubscriptionRepository;

  async execute(data: CreateProfessionalSubscriptionInput) {
    const professional = await this.professionalRepo.findById(
      data.professionalId,
    );

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    const subscriptionPlan = await this.subsPlanRepo.findByPriceId({
      stripePriceId: data.stripePriceId,
    });

    if (!subscriptionPlan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const newSubscription = ProfessionalSubscriptionBuilder.create({
      professional,
      subscriptionPlan,
      stripeSubscriptionId: data.stripeSubscriptionId,
    });

    await this.professionalSubsRepo.create(newSubscription);
  }
}
