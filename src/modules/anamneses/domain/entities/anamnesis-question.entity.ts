import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { QUESTION_TYPE } from '../enums/question-type.enum';

@Entity({ tableName: 'anamnesis_questions' })
export class AnamnesisQuestion {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @Property({ name: 'text', type: 'varchar', length: 255, nullable: false })
  text!: string;

  @Enum({ items: () => QUESTION_TYPE, name: 'type', type: 'varchar' })
  type!: QUESTION_TYPE;

  @Property({ name: 'questions', type: 'jsonb', nullable: true })
  questions: string[];

  @Property({ name: 'order', type: 'int', nullable: true })
  order!: number;
}
