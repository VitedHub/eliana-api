import { Client } from '@/clients/domain/entities/client.entity';
import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { AnamnesisAnswer } from './anamnesis-answer.entity';

@Entity({ tableName: 'anamneses' })
export class Anamnesis {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @OneToOne(() => Client, { joinColumn: 'client_id' })
  client!: Client;

  @OneToMany(() => AnamnesisAnswer, (a) => a.anamnesis)
  answers = new Collection<AnamnesisAnswer>(this);

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
