import { IAddressRepository } from '@/addresses/application/repositories/address.repository';
import { Address } from '@/addresses/domain/entities/address.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class AddressPgRepository implements IAddressRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async findById(id: string): Promise<Address | null> {
    const address = await this.entityManager.findOne(Address, { id: id });

    return address;
  }
}
