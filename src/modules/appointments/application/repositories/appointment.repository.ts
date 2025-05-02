import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { APPOINTMENT_STATUS } from '@/appointments/domain/enums/appointment-status.enum';
import { Client } from '@/clients/domain/entities/client.entity';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';

export abstract class IAppointmentRepository {
  abstract bookAppointment(data: BookAppointmentInput): Promise<Appointment>;
  abstract listClientAppointments(data: {
    clientId: string;
  }): Promise<Appointment[]>;
  abstract listProfessionalAppointmentInRange(
    data: ListProfessionalAppointmentsInRangeInput,
  ): Promise<Appointment[]>;
  abstract getBookedDates(data: {
    startDate: Date;
    endDate: Date;
  }): Promise<Pick<Appointment, 'date' | 'timeSlot'>[]>;
}

export interface BookAppointmentInput {
  appointmentId: string;
  date: Date;
  timeSlot: TimeSlot;
  client: Client;
  status: APPOINTMENT_STATUS;
}

export interface ListProfessionalAppointmentsInRangeInput {
  professionalId: string;
  establishmentId?: string;
  startDate: Date;
  endDate: Date;
}
