import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Schedule } from './schedule.entity';
import { Professional } from '@/professionals/domain/entities/professionals.entity';

@Entity({ tableName: 'time_slots' })
export class TimeSlot {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @ManyToOne(() => Professional, { joinColumn: 'professional_id' })
  professional!: Professional;

  @Property({ name: 'start_time', type: 'time', nullable: false })
  startTime!: string;

  @Property({ name: 'end_time', type: 'time', nullable: false })
  endTime!: string;

  @ManyToOne(() => Schedule, {
    joinColumn: 'schedule_id',
  })
  schedule!: Schedule;

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
