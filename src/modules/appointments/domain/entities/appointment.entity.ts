import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { APPOINTMENT_STATUS } from '../enums/appointment-status.enum';
import { Client } from '../../../clients/domain/entities/client.entity';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';

@Entity({ tableName: 'appointments' })
export class Appointment {
  @PrimaryKey({ name: 'id', type: 'uuid', nullable: false })
  id!: string;

  @ManyToOne(() => Professional, { joinColumn: 'professional_id' })
  professional!: Professional;

  @ManyToOne(() => Establishment, { joinColumn: 'establishment_id' })
  establishment!: Establishment;

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
    name: 'google_calendar_event_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  googleCalendarEventId?: string;

  @Property({
    name: 'google_calendar_event_url',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  googleCalendarEventUrl?: string;

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
