import { Appointment } from '@/appointments/domain/entities/appointment.entity';

export abstract class IClientAppointmentRepository {
  abstract bookAppointment(data: Appointment): Promise<Appointment>;

  abstract listClientAppointments(
    data: ListClientAppointmentsInput,
  ): Promise<Appointment[]>;

  abstract getBookedDates(data: GetBookedDatesInput): Promise<Appointment[]>;
}

export interface GetBookedDatesInput {
  startDate: Date;
  endDate: Date;
  establishmentId: string;
  professionalId: string;
}

export interface ListClientAppointmentsInput {
  clientId: string;
  establishmentId?: string;
  professionalId?: string;
}
