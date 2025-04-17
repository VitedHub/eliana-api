import { Client } from '@/clients/domain/entities/client.entity';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { AnamnesisAnswer } from './anamnesis-answer.entity';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';

@Entity({ tableName: 'anamneses' })
export class Anamnesis {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @ManyToOne(() => Professional)
  professional!: Professional;

  @ManyToOne(() => Establishment)
  establishment!: Establishment;

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
