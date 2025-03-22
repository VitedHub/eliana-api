import { Inject, NotFoundException } from '@nestjs/common';
import { IAnamnesisRepository } from '../repositories/anamnesis.repository';
import { Anamnesis } from '@/anamneses/domain/entities/anamnesis.entity';
import { IAnamnesisQuestionRepository } from '../repositories/anamnesis-question.repository';
import { AnamnesisQuestion } from '@/anamneses/domain/entities/anamnesis-question.entity';

export type DetailAnamnesisInput = {
  anamnesisId: string;
};

export type DetailAnamnesisOutput = {
  anamnesis: Anamnesis;
  questions: AnamnesisQuestion[];
};

export class DetailAnamnesis {
  @Inject(IAnamnesisRepository)
  private anamnesisRepo: IAnamnesisRepository;
  @Inject(IAnamnesisQuestionRepository)
  private questionRepo: IAnamnesisQuestionRepository;

  async execute(data: DetailAnamnesisInput): Promise<DetailAnamnesisOutput> {
    const anamnesis = await this.anamnesisRepo.findById({
      id: data.anamnesisId,
    });

    if (!anamnesis) throw new NotFoundException('Anamnesis not found');

    const questions = await this.questionRepo.listQuestions();

    return {
      anamnesis,
      questions,
    };
  }
}
