import { Appointment } from '@/appointments/domain/entities/appointment.entity';

export class ListProfessionalDailyAppointmentsPresenter {
  static toHTTP(data: Appointment) {
    return {
      client: {
        id: data.client.id,
        name: data.client.name,
      },
      establishment: {
        id: data.establishment.id,
        name: data.establishment.name,
      },
      startTime: data.timeSlot.startTime,
      endTime: data.timeSlot.endTime,
      status: data.status,
    };
  }
}
