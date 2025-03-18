import { Module } from '@nestjs/common';
import { IAnamnesisQuestionRepository } from './application/repositories/anamnesis-question.repository';
import { AnamnesisQuestionPgRepository } from './data/repositories/mikro-orm/anamnesis-question.pg.repository';
import { ListQuestions } from './application/usecases/list-questions.usecase';
import { ClientAnamnesisQuestionsController } from './api/controllers/questions/client-anamnesis-questions.controller';
import { IAnamnesisAnswerRepository } from './application/repositories/anamnesis-answer.repository';
import { AnamnesisAnswerPgRepository } from './data/repositories/mikro-orm/anamnesis-answer.pg.repository';
import { IAnamnesisRepository } from './application/repositories/anamnesis.repository';
import { AnamnesisPgRepository } from './data/repositories/mikro-orm/anamnesis.pg.repository';
import { RegisterAnamnesisAnswer } from './application/usecases/register-anamnesis-answer.usecase';

@Module({
  providers: [
    {
      provide: IAnamnesisRepository,
      useClass: AnamnesisPgRepository,
    },
    {
      provide: IAnamnesisQuestionRepository,
      useClass: AnamnesisQuestionPgRepository,
    },
    {
      provide: IAnamnesisAnswerRepository,
      useClass: AnamnesisAnswerPgRepository,
    },
    RegisterAnamnesisAnswer,
    ListQuestions,
  ],
  controllers: [ClientAnamnesisQuestionsController],
})
export class AnamnesisModule {}
