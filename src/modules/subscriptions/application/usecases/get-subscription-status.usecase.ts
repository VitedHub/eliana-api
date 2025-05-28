import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { IProfessionalSubscriptionRepository } from '../repositories/professional-subscription.repository';

export type GetSubscriptionStatusInput = {
  professional: Professional;
};

export class GetSubscriptionStatus {
  @Inject(IProfessionalSubscriptionRepository)
  private professionalSubsRepo: IProfessionalSubscriptionRepository;

  async execute(data: GetSubscriptionStatusInput) {
    if (!data.professional) {
      throw new UnauthorizedException(
        'You must be logged in to use this feature',
      );
    }

    const subscription = await this.professionalSubsRepo.findByProfessionalId(
      data.professional.id,
    );

    return subscription;
  }
}
