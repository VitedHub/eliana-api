import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Establishment } from './establishment.entity';

@Entity({ tableName: 'establishment_professionals' })
export class EstablishmentProfessional {
  @PrimaryKey({ name: 'id', type: 'uuid', nullable: false })
  id!: string;

  @ManyToOne(() => Professional, { joinColumn: 'professional_id' })
  professional!: Professional;

  @ManyToOne(() => Establishment, { joinColumn: 'establishment_id' })
  establishment: Establishment;

  @Property({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  active: boolean = true;

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
