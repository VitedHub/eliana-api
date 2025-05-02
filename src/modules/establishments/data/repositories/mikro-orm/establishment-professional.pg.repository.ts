import {
  ExistsEstablishmentProfessionalInput,
  IEstablishmentProfessionalRepository,
} from '@/establishments/application/repositories/establishment-professional.repository';
import { EstablishmentProfessional } from '@/establishments/domain/entities/establishment-professional.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class EstablishmentProfessionaPgRepository
  implements IEstablishmentProfessionalRepository
{
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async exists(data: ExistsEstablishmentProfessionalInput): Promise<boolean> {
    const count = await this.entityManager.count(EstablishmentProfessional, {
      professional: data.professionalId,
      establishment: data.professionalId,
      active: true,
    });

    return count > 0;
  }
}
