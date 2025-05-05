import { Client } from '@/clients/domain/entities/client.entity';
import { Establishment } from '@/establishments/domain/entities/establishment.entity';
import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';
import { Appointment } from '../entities/appointment.entity';
import { randomUUID } from 'crypto';

export class AppointmentBuilder {
  static create(data: AppointmentData): Appointment {
    const appointment = new Appointment();
    appointment.id = randomUUID();
    appointment.client = data.client;
    appointment.professional = data.professional;
    appointment.establishment = data.establishment;
    appointment.timeSlot = data.timeSlot;
    appointment.date = new Date(data.date);

    return appointment;
  }
}

export interface AppointmentData {
  professional: Professional;
  establishment: Establishment;
  client: Client;
  timeSlot: TimeSlot;
  date: string;
}
