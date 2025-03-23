import { Client } from '@/clients/domain/entities/client.entity';
import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { TimeSlot } from './time-slot.entity';
import { APPOINTMENT_STATUS } from '../enums/appointment-status';

@Entity({ tableName: 'scheduled_appointment' })
export class ScheduledAppointment {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @ManyToOne(() => Client, { joinColumn: 'client_id' })
  client!: Client;

  @ManyToOne(() => TimeSlot, { joinColumn: 'time_slot_id' })
  timeSlot!: TimeSlot;

  @Property({ name: 'date', type: 'date', nullable: false })
  date!: Date;

  @Enum({
    items: () => APPOINTMENT_STATUS,
    name: 'status',
    type: 'varchar',
    nullable: false,
  })
  status!: APPOINTMENT_STATUS;

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
