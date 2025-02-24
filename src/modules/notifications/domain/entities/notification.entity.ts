import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { Client } from '@/clients/domain/entities/client.entity';
import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { NOTIFICATION_STAUS } from '../enums/notification-status.enum';

@Entity({ tableName: 'notifications' })
export class Notification {
  @PrimaryKey({ name: 'id', type: 'uuid' })
  id!: string;

  @ManyToOne(() => Appointment, {
    nullable: true,
    joinColumn: 'appointment_id',
  })
  appointment?: Appointment;

  @ManyToOne(() => Client, { nullable: true, joinColumn: 'client_id' })
  client?: Client;

  @Enum({ items: () => NOTIFICATION_STAUS, name: 'status', type: 'varchar' })
  status!: NOTIFICATION_STAUS;

  @Property({ name: 'message', type: 'text', nullable: true })
  message?: string;

  @Property({ name: 'sent_at', type: 'time with time zone', nullable: true })
  sentAt?: Date;

  @Property({
    name: 'created_at',
    onCreate: () => new Date(),
    type: 'timestamp with time zone',
  })
  createdAt: Date = new Date();
}
