import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'addresses' })
export class Address {
  @PrimaryKey({ name: 'id', type: 'uuid', nullable: false })
  id!: string;

  @Property({ type: 'varchar' })
  street!: string;

  @Property({ type: 'varchar', nullable: true })
  number?: string;

  @Property({ type: 'varchar', nullable: true })
  complement?: string;

  @Property({ type: 'varchar' })
  district!: string;

  @Property({ type: 'varchar' })
  city!: string;

  @Property({ type: 'varchar', length: 2 })
  state!: string;

  @Property({ type: 'varchar' })
  zipCode!: string;

  @Property({ type: 'varchar', default: 'Brazil' })
  country: string = 'Brazil';

  @Property({ type: 'float', nullable: true })
  latitude?: number;

  @Property({ type: 'float', nullable: true })
  longitude?: number;

  @Property({ onCreate: () => new Date(), type: 'timestamp with time zone' })
  createdAt: Date = new Date();
}
