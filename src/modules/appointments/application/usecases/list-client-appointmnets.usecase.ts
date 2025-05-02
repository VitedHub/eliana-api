import { Inject } from '@nestjs/common';
import { IClientAppointmentRepository } from '../repositories/client-appointment.repository';

export type ListClientAppointmentsInput = {
  clientId: string;
};

export class ListClientAppointments {
  @Inject(IClientAppointmentRepository)
  private appotintmentRepo: IClientAppointmentRepository;

  async execute(data: ListClientAppointmentsInput) {
    return await this.appotintmentRepo.listClientAppointments({
      clientId: data.clientId,
    });
  }
}
