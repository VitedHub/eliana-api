import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { DAY_OF_WEEK } from '../enums/day-of-week.enum';
import { TimeSlot } from './time-slot.entity';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';

@Entity({ tableName: 'schedules' })
export class Schedule {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @ManyToOne(() => Establishment, { joinColumn: 'establishment_id' })
  establishment!: Establishment;

  @Enum({
    items: () => DAY_OF_WEEK,
    name: 'day_of_week',
    columnType: 'varchar',
  })
  dayOfWeek!: DAY_OF_WEEK;

  @Property({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean = true;

  @OneToMany(() => TimeSlot, (timeSlot) => timeSlot.schedule)
  timeSlot = new Collection<TimeSlot>(this);

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
