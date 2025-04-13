import { Client } from '@/clients/domain/entities/client.entity';

export abstract class IClientRepository {
  abstract create(data: Client): Promise<Client>;
  abstract findByProviderId(providerId: string): Promise<Client | null>;
  abstract findById(id: string): Promise<Client | null>;
  abstract findByEmail(email: string): Promise<Client | null>;
  abstract update(data: Client): Promise<void>;
}
