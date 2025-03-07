import {
  ArrayType,
  Collection,
  Entity,
  Enum,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { AUTH_PROVIDER } from '../enums/auth-provider.enum';
import { Appointment } from '../../../appointments/domain/entities/appointment.entity';

@Entity({ tableName: 'clients' })
export class Client {
  @PrimaryKey({ name: 'id', type: 'uuid', nullable: false })
  id!: string;

  @Property({ name: 'name', type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Property({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Property({ name: 'phone', type: 'varchar', length: 11, nullable: true })
  phone?: string;

  @Property({ name: 'password', type: 'varchar', length: 255, nullable: true })
  password?: string;

  @Property({
    name: 'two_factor_enable',
    type: 'boolean',
    nullable: true,
    default: false,
  })
  twoFactorEnable?: boolean = false;

  @Property({ name: 'two_factor_code', type: 'varchar', nullable: true })
  twoFactorCode?: string;

  @Property({
    name: 'two_factor_code_expires_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  twoFactorCodeExpiresAt?: Date;

  @Enum({
    name: 'auth_provider',
    type: ArrayType,
    nullable: false,
    default: [],
  })
  authProviders: AUTH_PROVIDER[] = [];

  @Property({ name: 'oauth_id', type: 'varchar', length: 255, nullable: true })
  oAuthId?: string;

  @OneToMany(() => Appointment, (appointment) => appointment.client)
  appointments = new Collection<Appointment>(this);

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
