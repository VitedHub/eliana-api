import { IAnamnesisAnswerRepository } from '@/anamneses/application/repositories/anamnesis-answer.repository';
import { AnamnesisAnswer } from '@/anamneses/domain/entities/anamnesis-answer.entity';
import { AnamnesisQuestion } from '@/anamneses/domain/entities/anamnesis-question.entity';
import { Anamnesis } from '@/anamneses/domain/entities/anamnesis.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class AnamnesisAnswerPgRepository implements IAnamnesisAnswerRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async findOne(data: {
    anamnesis: Anamnesis;
    question: AnamnesisQuestion;
  }): Promise<AnamnesisAnswer> {
    const { anamnesis, question } = data;

    return await this.entityManager.findOne(AnamnesisAnswer, {
      anamnesis,
      question,
    });
  }

  async registerAnswer(data: AnamnesisAnswer): Promise<void> {
    const answers = this.entityManager.create(AnamnesisAnswer, data);
    await this.entityManager.persistAndFlush(answers);
  }

  async updateAnswer(data: AnamnesisAnswer): Promise<void> {
    await this.entityManager.persistAndFlush(data);
  }
}
