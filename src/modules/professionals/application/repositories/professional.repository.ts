import { Professional } from '@/professionals/domain/entities/professionals.entity';

export abstract class IProfessionalRepository {
  abstract create(data: Professional): Promise<Professional>;
  abstract findByProviderId(providerId: string): Promise<Professional | null>;
  abstract findByEmail(email: string): Promise<Professional | null>;
  abstract update(data: Professional): Promise<void>;
}
