import { Appointment } from '@/appointments/domain/entities/appointment.entity';

export abstract class IAppointmentRepository {
  abstract listClientAppointments(data: {
    clientId: string;
  }): Promise<Appointment[]>;
  abstract getBookedDates(data: {
    startDate: Date;
    endDate: Date;
  }): Promise<Pick<Appointment, 'date' | 'timeSlot'>[]>;
}
