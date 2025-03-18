import { IAnamnesisQuestionRepository } from '@/anamneses/application/repositories/anamnesis-question.repository';
import { AnamnesisQuestion } from '@/anamneses/domain/entities/anamnesis-question.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class AnamnesisQuestionPgRepository
  implements IAnamnesisQuestionRepository
{
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async findById(data: { id: string }): Promise<AnamnesisQuestion> {
    const question = await this.entityManager.findOne(
      AnamnesisQuestion,
      data.id,
    );

    return question;
  }

  async listQuestions(): Promise<AnamnesisQuestion[]> {
    const questions = await this.entityManager.findAll(AnamnesisQuestion);

    return questions;
  }
}
