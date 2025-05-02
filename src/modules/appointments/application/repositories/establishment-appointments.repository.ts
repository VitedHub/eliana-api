import { Appointment } from '@/appointments/domain/entities/appointment.entity';

export abstract class IEstablishmentAppointmentRepository {
  abstract getDailyAppointment(
    data: GetEstablishmentDailyAppointmentIput,
  ): Promise<Appointment[]>;

  abstract getAppointmentInRange(
    data: GetEstablishmentAppointmentsInRangeInput,
  ): Promise<Appointment[]>;
}

export interface GetEstablishmentAppointmentsInRangeInput {
  establishmentId: string;
  startDate: Date;
  endDate: Date;
  professionalId?: string;
}

export interface GetEstablishmentDailyAppointmentIput {
  establishmentId: string;
  date: Date;
  professionalId?: string;
}
