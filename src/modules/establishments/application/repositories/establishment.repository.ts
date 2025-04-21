import { Establishment } from '@/establishments/domain/entities/establishment.entity';

export abstract class IEstablishmentRepository {
  abstract create(data: Establishment): Promise<Establishment>;
  abstract findByOwner(ownerId: string): Promise<Establishment[]>;
  abstract findById(id: string): Promise<Establishment | null>;
  abstract findByCnpj(cnpj: string): Promise<Establishment | null>;
}
