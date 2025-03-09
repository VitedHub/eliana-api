import { Module } from '@nestjs/common';
import { IAnamnesisQuestionRepository } from './application/repositories/anamnesis-question.repository';
import { AnamnesisQuestionPgRepository } from './data/repositories/mikro-orm/anamnesis-question.pg.repository';
import { ListQuestions } from './application/usecases/list-questions.usecase';
import { ClientAnamnesisQuestionsController } from './api/controllers/questions/client-anamnesis-questions.controller';

@Module({
  providers: [
    {
      provide: IAnamnesisQuestionRepository,
      useClass: AnamnesisQuestionPgRepository,
    },
    ListQuestions,
  ],
  controllers: [ClientAnamnesisQuestionsController],
})
export class AnamnesisModule {}
