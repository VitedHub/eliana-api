import { AnamnesisQuestion } from '@/anamneses/domain/entities/anamnesis-question.entity';

export abstract class IAnamnesisQuestionRepository {
  abstract findById(data: { id: string }): Promise<AnamnesisQuestion>;
  abstract listQuestions(): Promise<AnamnesisQuestion[]>;
}
