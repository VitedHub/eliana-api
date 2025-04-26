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

  async findByOwner(ownerId: string): Promise<Establishment[]> {
    const establishments = await this.entityManager.findAll(Establishment, {
      where: {
        owner: ownerId,
      },
      populate: ['owner', 'address', 'professionals'],
    });

    return establishments;
  }

  async findById(id: string): Promise<Establishment | null> {
    const establishment = await this.entityManager.findOne(Establishment, id, {
      populate: ['address', 'professionals'],
    });

    return establishment;
  }

  async findByCnpj(cnpj: string): Promise<Establishment | null> {
    const establishment = await this.entityManager.findOne(Establishment, {
      cnpj,
    });
    return establishment;
  }
}
