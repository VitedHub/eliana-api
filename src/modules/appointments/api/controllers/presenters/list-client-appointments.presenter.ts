import { Appointment } from '@/appointments/domain/entities/appointment.entity';

export class ListClientAppointmentsPresenter {
  static toHTTP(data: Appointment) {
    const normalizeDate = (date: Date) => date.toISOString().split('T')[0];

    return {
      id: data.id,
      dayOfWeek: data.timeSlot.schedule.dayOfWeek,
      date: normalizeDate(data.date),
      timeSlot: {
        id: data.timeSlot.id,
        startTime: data.timeSlot.startTime,
        endTime: data.timeSlot.endTime,
      },
    };
  }
}
