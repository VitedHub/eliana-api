import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class ProfessionalPgRepository implements IProfessionalRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async create(data: Professional): Promise<Professional> {
    const professional = this.entityManager.create(Professional, data);
    await this.entityManager.persistAndFlush(professional);

    return professional;
  }

  async findByProviderId(providerId: string): Promise<Professional | null> {
    const professional = await this.entityManager.findOne(Professional, {
      oAuthId: providerId,
    });

    return professional;
  }

  async findByEmail(email: string): Promise<Professional | null> {
    const professional = await this.entityManager.findOne(Professional, {
      email: email,
    });

    return professional;
  }

  async update(data: Professional): Promise<void> {
    const professional = await this.entityManager.findOne(Professional, {
      id: data.id,
    });

    if (professional) {
      this.entityManager.assign(professional, data);
      await this.entityManager.flush();
    }
  }
}
