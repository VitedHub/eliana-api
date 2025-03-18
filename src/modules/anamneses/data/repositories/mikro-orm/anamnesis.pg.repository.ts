import { IAnamnesisRepository } from '@/anamneses/application/repositories/anamnesis.repository';
import { Anamnesis } from '@/anamneses/domain/entities/anamnesis.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class AnamnesisPgRepository implements IAnamnesisRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async findById(data: { id: string }): Promise<Anamnesis> {
    const anamnesis = await this.entityManager.findOne(Anamnesis, data.id);
    return anamnesis;
  }
}
