import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IProfessionalSubscriptionRepository } from '../repositories/professional-subscription.repository';

export type DeactivateProfessionalSubscriptionInput = {
  stripeSubscriptionId: string;
};

@Injectable()
export class DeactivateProfessionalSubscription {
  @Inject(IProfessionalSubscriptionRepository)
  private readonly professionalSubsnRepo: IProfessionalSubscriptionRepository;

  async execute(data: DeactivateProfessionalSubscriptionInput): Promise<void> {
    const subscription = await this.professionalSubsnRepo.findOne({
      stripeSubscriptionId: data.stripeSubscriptionId,
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    subscription.isActive = false;
    subscription.endDate = new Date();

    await this.professionalSubsnRepo.update(subscription);
  }
}
