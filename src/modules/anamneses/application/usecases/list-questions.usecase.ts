import { Inject } from '@nestjs/common';
import { IAnamnesisQuestionRepository } from '../repositories/anamnesis-question.repository';
import { AnamnesisQuestion } from '@/anamneses/domain/entities/anamnesis-question.entity';

export class ListQuestions {
  @Inject(IAnamnesisQuestionRepository)
  private readonly anamnesisQuestionRepo: IAnamnesisQuestionRepository;

  async execute(): Promise<AnamnesisQuestion[]> {
    const questions = await this.anamnesisQuestionRepo.listQuestions();

    return questions;
  }
}
