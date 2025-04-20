import { Address } from '@/addresses/domain/entities/address.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { EstablishmentProfessional } from './establishment-professional.entity';
import { Professional } from '@/professionals/domain/entities/professionals.entity';

@Entity({ tableName: 'establishments' })
export class Establishment {
  @PrimaryKey({ name: 'id', type: 'uuid', nullable: false })
  id!: string;

  @Property({ name: 'cnpj', type: 'varchar', nullable: true, unique: true })
  cnpj?: string;

  @ManyToOne(() => Professional, { joinColumn: 'owner_id' })
  owner!: string;

  @Property({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Property({ name: 'description', type: 'text', nullable: false })
  description?: string;

  @Property({ name: 'phone', type: 'varchar', length: 11, nullable: true })
  phone?: string;

  @Property({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
    unique: true,
  })
  email?: string;

  @Property({ name: 'public_url', type: 'varchar', unique: true })
  publicUrl!: string;

  @ManyToOne(() => Address, { nullable: false, joinColumn: 'address_id' })
  address!: Address;

  @OneToMany(() => EstablishmentProfessional, (ep) => ep.establishment)
  professionals = new Collection<EstablishmentProfessional>(this);

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
