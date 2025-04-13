import { Inject } from '@nestjs/common';
import { IAppointmentRepository } from '../repositories/appointment.repository';

export type ListClientAppointmentsInput = {
  clientId: string;
};

export class ListClientAppointments {
  @Inject(IAppointmentRepository)
  private appotintmentRepo: IAppointmentRepository;

  async execute(data: ListClientAppointmentsInput) {
    return await this.appotintmentRepo.listClientAppointments({
      clientId: data.clientId,
    });
  }
}
