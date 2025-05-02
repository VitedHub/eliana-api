import { Appointment } from '@/appointments/domain/entities/appointment.entity';

export class ListProfessionalMonthAppointmentPresenter {
  static toHTTP(data: Appointment[]) {
    const normalizeDate = (date: Date) => date.toISOString().split('T')[0];

    const uniqueDays = Array.from(
      new Set(data.map((appointment) => normalizeDate(appointment.date))),
    );

    return uniqueDays;
  }
}
