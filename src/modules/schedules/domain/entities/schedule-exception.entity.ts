import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Schedule } from './schedule.entity';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';

@Entity({ tableName: 'schedule_exception' })
export class ScheduleException {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @ManyToOne(() => Professional)
  professional!: Professional;

  @ManyToOne(() => Establishment)
  establishment!: Establishment;

  @ManyToOne(() => Schedule, { joinColumn: 'schedule_id' })
  schedule!: Schedule;

  @Property({ name: 'exception_date', type: 'date' })
  exceptionDate!: Date;

  @Property({ name: 'start_time', type: 'time' })
  startTime!: string;

  @Property({ name: 'end_time', type: 'time' })
  endTime!: string;

  @Property({ name: 'is_blocked', type: 'boolean', default: true })
  isBlocked: boolean = true;
}
