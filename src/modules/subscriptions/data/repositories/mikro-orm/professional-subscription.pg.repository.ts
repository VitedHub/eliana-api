import {
  FindOneProfessionalSubsarams,
  IProfessionalSubscriptionRepository,
} from '@/subscriptions/application/repositories/professional-subscription.repository';
import { ProfessionalSubscription } from '@/subscriptions/domain/entities/professional-subscription.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProfessionalSubscriptionPgRepository
  implements IProfessionalSubscriptionRepository
{
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async create(data: ProfessionalSubscription): Promise<void> {
    const subs = this.entityManager.create(ProfessionalSubscription, data);
    await this.entityManager.persistAndFlush(subs);
  }

  async findOne(
    data: FindOneProfessionalSubsarams,
  ): Promise<ProfessionalSubscription | null> {
    return await this.entityManager.findOne(ProfessionalSubscription, data);
  }

  async findByProfessionalId(
    professionalId: string,
  ): Promise<ProfessionalSubscription | null> {
    return await this.entityManager.findOne(ProfessionalSubscription, {
      professional: professionalId,
    });
  }

  async update(data: ProfessionalSubscription): Promise<void> {
    await this.entityManager.nativeUpdate(
      ProfessionalSubscription,
      {
        id: data.id,
      },
      data,
    );
  }

  async deactivate(id: string): Promise<void> {
    await this.entityManager.nativeUpdate(ProfessionalSubscription, id, {
      isActive: false,
    });
  }
}
