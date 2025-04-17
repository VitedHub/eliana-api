import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'addresses' })
export class Address {
  @PrimaryKey({ name: 'id', type: 'uuid', nullable: false })
  id!: string;

  @Property({ type: 'varchar' })
  number!: string;

  @Property({ type: 'varchar', nullable: true })
  complement?: string;

  @Property({ type: 'varchar' })
  district!: string;

  @Property({ type: 'varchar' })
  city!: string;

  @Property({ type: 'varchar' })
  state!: string;

  @Property({ type: 'varchar' })
  zipCode!: string;

  @Property({ type: 'varchar', default: 'Brasil' })
  country: string = 'Brasil';

  @Property({ type: 'float', nullable: true })
  latitude?: number;

  @Property({ type: 'float', nullable: true })
  longitude?: number;

  @Property({ onCreate: () => new Date(), type: 'timestamp with time zone' })
  createdAt: Date = new Date();
}
