import { BookAppointmentOutput } from '@/appointments/application/usecases/book-appointment.usecase';

export class BookAppointmentPresenter {
  static toHTTP(data: BookAppointmentOutput) {
    return {
      message: `Congratulations ${data.client.name}! Your appointment has been successfully booked`,
    };
  }
}
