import { Establishment } from '@/establishments/domain/entities/establishment.entity';

export abstract class IEstablishmentRepository {
  abstract create(data: Establishment): Promise<Establishment>;
}
