import { Address } from '@/addresses/domain/entities/address.entity';
import { IEstablishmentRepository } from '@/establishments/application/repositories/establishment.repository';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';
import { Schedule } from '@/schedules/domain/entities/schedule.entity';
import { DAY_OF_WEEK } from '@/schedules/domain/enums/day-of-week.enum';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';

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

      Object.values(DAY_OF_WEEK).map((day) => {
        const isWeekend =
          day === DAY_OF_WEEK.SATURDAY || day === DAY_OF_WEEK.SUNDAY;

        return em.create(Schedule, {
          id: randomUUID(),
          dayOfWeek: day,
          isActive: !isWeekend,
          establishment,
        });
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
      populate: ['address', 'professionals', 'schedules'],
    });

    return establishment;
  }

  async findByEmail(email: string): Promise<Establishment | null> {
    const establishment = await this.entityManager.findOne(Establishment, {
      email,
    });
    return establishment;
  }

  async findByPublicURL(slug: string): Promise<Establishment | null> {
    return await this.entityManager.findOne(
      Establishment,
      {
        publicUrl: slug,
      },
      { populate: ['professionals'] },
    );
  }

  async findByCnpj(cnpj: string): Promise<Establishment | null> {
    const establishment = await this.entityManager.findOne(Establishment, {
      cnpj,
    });
    return establishment;
  }

  async countByOwnerId(ownerId: string): Promise<number> {
    return await this.entityManager.count(Establishment, {
      owner: ownerId,
    });
  }
}
