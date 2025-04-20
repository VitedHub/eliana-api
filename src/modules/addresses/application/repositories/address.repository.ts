import { Address } from '@/addresses/domain/entities/address.entity';

export abstract class IAddressRepository {
  abstract findById(id: string): Promise<Address | null>;
}
