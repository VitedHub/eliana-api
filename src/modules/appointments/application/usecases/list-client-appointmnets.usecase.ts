import { Inject } from '@nestjs/common';
import { IAppointmentRepository } from '../repositories/appointment.repository';
import { AppointmentPgRepository } from '@/appointments/data/repositories/mikro-orm/appointment.pg.repository';

export type ListClientAppointmentsInput = {
  clientId: string;
};

export class ListClientAppointments {
  @Inject(IAppointmentRepository)
  private appotintmentRepo: AppointmentPgRepository;

  async execute(data: ListClientAppointmentsInput) {
    return await this.appotintmentRepo.listClientAppointments({
      clientId: data.clientId,
    });
  }
}
