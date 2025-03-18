import { Anamnesis } from '@/anamneses/domain/entities/anamnesis.entity';

export abstract class IAnamnesisRepository {
  abstract findById(data: { id: string }): Promise<Anamnesis>;
}
