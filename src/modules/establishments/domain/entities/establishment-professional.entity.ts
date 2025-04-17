import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Establishment } from './establishment.entity';

@Entity({ tableName: 'establishment_professionals' })
export class EstablishmentProfessional {
  @PrimaryKey({ name: 'id', type: 'uuid', nullable: false })
  id!: string;

  @ManyToOne(() => Professional)
  professional!: Professional;

  @ManyToOne(() => Establishment)
  establishment: Establishment;

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
