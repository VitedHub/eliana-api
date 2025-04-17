import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { QUESTION_TYPE } from '../enums/question-type.enum';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';
import { Professional } from '@/professionals/domain/entities/professionals.entity';

@Entity({ tableName: 'anamnesis_questions' })
export class AnamnesisQuestion {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @ManyToOne(() => Professional, { nullable: true })
  professional?: Professional;

  @ManyToOne(() => Establishment, { nullable: true })
  establishment?: Establishment;

  @Property({ name: 'text', type: 'varchar', length: 255, nullable: false })
  text!: string;

  @Enum({ items: () => QUESTION_TYPE, name: 'type', type: 'varchar' })
  type!: QUESTION_TYPE;

  @Property({ name: 'options', type: 'text[]', nullable: true })
  options: string[];

  @Property({ name: 'order', type: 'int', nullable: true })
  order!: number;
}
