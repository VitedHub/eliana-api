import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Anamnesis } from './anamnesis.entity';
import { AnamnesisQuestion } from './anamnesis-question.entity';

@Entity({ tableName: 'anamnesis_answers' })
export class AnamnesisAnswer {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @ManyToOne(() => Anamnesis, { joinColumn: 'anamnesis_id' })
  anamnesis!: Anamnesis;

  @ManyToOne(() => AnamnesisQuestion, { joinColumn: 'question_id' })
  question!: AnamnesisQuestion;

  @Property({ name: 'answer', type: 'text', nullable: true })
  answer!: string;

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
