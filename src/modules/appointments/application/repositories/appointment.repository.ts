import { Appointment } from '@/appointments/domain/entities/appointment.entity';

export abstract class IAppointmentRepository {
  abstract getBookedDates(data: {
    startDate: Date;
    endDate: Date;
  }): Promise<Pick<Appointment, 'date' | 'timeSlot'>[]>;
}
