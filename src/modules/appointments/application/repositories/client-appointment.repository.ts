import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { APPOINTMENT_STATUS } from '@/appointments/domain/enums/appointment-status.enum';
import { Client } from '@/clients/domain/entities/client.entity';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';

export abstract class IClientAppointmentRepository {
  abstract bookAppointment(data: BookAppointmentInput): Promise<Appointment>;

  abstract listClientAppointments(data: {
    clientId: string;
  }): Promise<Appointment[]>;

  abstract getBookedDates(data: GetBookedDatesInput): Promise<Appointment[]>;
}

export interface BookAppointmentInput {
  appointmentId: string;
  date: Date;
  timeSlot: TimeSlot;
  client: Client;
  status: APPOINTMENT_STATUS;
}

export interface GetBookedDatesInput {
  startDate: Date;
  endDate: Date;
  establishmentId: string;
  professionalId: string;
}
