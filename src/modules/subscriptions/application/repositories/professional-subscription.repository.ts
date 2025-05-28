import { ProfessionalSubscription } from '@/subscriptions/domain/entities/professional-subscription.entity';

export abstract class IProfessionalSubscriptionRepository {
  abstract create(data: ProfessionalSubscription): Promise<void>;
  abstract findOne(
    data: FindOneProfessionalSubsarams,
  ): Promise<ProfessionalSubscription | null>;
  abstract findByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalSubscription | null>;
  abstract deactivate(id: string): Promise<void>;
  abstract update(data: ProfessionalSubscription): Promise<void>;
}

export type FindOneProfessionalSubsarams = {
  stripeSubscriptionId?: string;
};
