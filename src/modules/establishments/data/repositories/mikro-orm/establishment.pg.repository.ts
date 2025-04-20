import { Address } from '@/addresses/domain/entities/address.entity';
import { IEstablishmentRepository } from '@/establishments/application/repositories/establishment.repository';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class EstablishmentPgRepository implements IEstablishmentRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async create(data: Establishment): Promise<Establishment> {
    return this.entityManager.transactional(async (em) => {
      const address = em.create(Address, {
        ...data.address,
        id: data.address.id,
      });

      const establishment = em.create(Establishment, {
        ...data,
        address,
      });

      return establishment;
    });
  }
}
