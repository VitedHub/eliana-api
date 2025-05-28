import { AUTH_PROVIDER } from '@/clients/domain/enums/auth-provider.enum';
import { EstablishmentProfessional } from '@/establishments/domain/entities/establishment-professional.entity';
import { ProfessionalSubscription } from '@/subscriptions/domain/entities/professional-subscription.entity';
import {
  ArrayType,
  Collection,
  Entity,
  Enum,
  OneToMany as OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity({ tableName: 'professionals' })
export class Professional {
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

  @Enum({
    name: 'auth_provider',
    type: ArrayType,
    nullable: false,
    default: [],
  })
  authProviders: AUTH_PROVIDER[] = [];

  @Property({ name: 'oauth_id', type: 'varchar', length: 255, nullable: true })
  oAuthId?: string;

  @OneToOne(() => EstablishmentProfessional, (ep) => ep.professional)
  establishments = new Collection<EstablishmentProfessional>(this);

  @OneToOne(() => ProfessionalSubscription, (ps) => ps.professional)
  subscriptions = new Collection<ProfessionalSubscription>(this);

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();

  get activeSubscription(): ProfessionalSubscription | null {
    return this.subscriptions.getItems().find((sub) => sub.isActive) || null;
  }
}
