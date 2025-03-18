import { Inject, NotFoundException } from '@nestjs/common';
import { IAnamnesisRepository } from '../repositories/anamnesis.repository';
import { IAnamnesisQuestionRepository } from '../repositories/anamnesis-question.repository';
import { IAnamnesisAnswerRepository } from '../repositories/anamnesis-answer.repository';
import { randomUUID } from 'crypto';

export type RegisterAnamnesisInput = {
  anamnesisId: string;
  answers: {
    questionId: string;
    answer: string[];
  }[];
};

export class RegisterAnamnesisAnswer {
  @Inject(IAnamnesisRepository)
  private anamnesisRepo: IAnamnesisRepository;
  @Inject(IAnamnesisQuestionRepository)
  private anamnesisQuestionRepo: IAnamnesisQuestionRepository;
  @Inject(IAnamnesisAnswerRepository)
  private anamnesisAnswerRepo: IAnamnesisAnswerRepository;

  async execute(data: RegisterAnamnesisInput): Promise<void> {
    const anamnesis = await this.anamnesisRepo.findById({
      id: data.anamnesisId,
    });

    if (!anamnesis) {
      throw new NotFoundException('Anamnese não encontrada');
    }

    for (const answerData of data.answers) {
      const question = await this.anamnesisQuestionRepo.findById({
        id: answerData.questionId,
      });

      if (!question) {
        throw new NotFoundException(
          `Questão de id: ${answerData.questionId} não encontrada.`,
        );
      }

      const existingAnswer = await this.anamnesisAnswerRepo.findOne({
        anamnesis,
        question: question,
      });

      if (existingAnswer) {
        existingAnswer.answer = answerData.answer;
        existingAnswer.createdAt = new Date();
        await this.anamnesisAnswerRepo.updateAnswer(existingAnswer);
      } else {
        await this.anamnesisAnswerRepo.registerAnswer({
          id: randomUUID(),
          anamnesis: anamnesis,
          question,
          answer: answerData.answer,
          createdAt: new Date(),
        });
      }
    }
  }
}
