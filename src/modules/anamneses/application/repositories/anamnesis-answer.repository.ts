import { AnamnesisAnswer } from '@/anamneses/domain/entities/anamnesis-answer.entity';
import { AnamnesisQuestion } from '@/anamneses/domain/entities/anamnesis-question.entity';
import { Anamnesis } from '@/anamneses/domain/entities/anamnesis.entity';

export abstract class IAnamnesisAnswerRepository {
  abstract findOne(data: {
    anamnesis: Anamnesis;
    question: AnamnesisQuestion;
  }): Promise<AnamnesisAnswer>;
  abstract registerAnswer(data: AnamnesisAnswer): Promise<void>;
  abstract updateAnswer(data: AnamnesisAnswer): Promise<void>;
}
