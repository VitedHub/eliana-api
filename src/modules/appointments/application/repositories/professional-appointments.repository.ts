import { Appointment } from '@/appointments/domain/entities/appointment.entity';

export abstract class IProfessionalAppointmentRepository {
  abstract getDailyAppointment(
    data: GetProfessionalDailyAppointmentIput,
  ): Promise<Appointment[]>;

  abstract getAppointmentInRange(
    data: GetProfessionalAppointmentsInRangeInput,
  ): Promise<Appointment[]>;
}

export interface GetProfessionalAppointmentsInRangeInput {
  professionalId: string;
  establishmentId?: string;
  startDate: Date;
  endDate: Date;
}

export interface GetProfessionalDailyAppointmentIput {
  professionalId: string;
  date: Date;
  establishmentId: string;
}
