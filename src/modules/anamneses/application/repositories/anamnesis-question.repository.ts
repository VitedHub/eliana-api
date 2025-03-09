import { AnamnesisQuestion } from '@/anamneses/domain/entities/anamnesis-question.entity';

export abstract class IAnamnesisQuestionRepository {
  abstract listQuestions(): Promise<AnamnesisQuestion[]>;
}
