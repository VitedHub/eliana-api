import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ISubscriptionPlanRepository } from '../repositories/subscription-plan.repository';
import { IProfessionalSubscriptionRepository } from '../repositories/professional-subscription.repository';
import { ProfessionalSubscriptionBuilder } from '@/subscriptions/domain/builders/professional-subscription.builder';

export type UpdateProfessionalSubscriptionInput = {
  professionalId: string;
  stripeSubscription: string;
  stripePriceId: string;
};

@Injectable()
export class UpdateProfessionalSubscription {
  @Inject(IProfessionalRepository)
  private professionalRepo: IProfessionalRepository;
  @Inject(ISubscriptionPlanRepository)
  private subsPlanRepo: ISubscriptionPlanRepository;
  @Inject(IProfessionalSubscriptionRepository)
  private professionalSubsRepo: IProfessionalSubscriptionRepository;

  async execute(data: UpdateProfessionalSubscriptionInput) {
    const professional = await this.professionalRepo.findById(
      data.professionalId,
    );

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    const currentSubscription =
      await this.professionalSubsRepo.findByProfessionalId(professional.id);

    if (!currentSubscription) {
      throw new NotFoundException('Current subscription not found');
    }

    const subscriptionPlan = await this.subsPlanRepo.findByPriceId({
      stripePriceId: data.stripePriceId,
    });

    if (!subscriptionPlan) {
      throw new NotFoundException('Subscription plan not found');
    }

    ProfessionalSubscriptionBuilder.update(currentSubscription, {
      subscriptionPlan,
      stripeSubscriptionId: data.stripeSubscription,
      startDate: new Date(),
    });

    await this.professionalSubsRepo.update(currentSubscription);
  }
}
