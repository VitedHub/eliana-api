import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { IEstablishmentRepository } from '@/establishments/application/repositories/establishment.repository';
import { IProfessionalAppointmentRepository } from '../repositories/professional-appointments.repository';

export type ListProfessionalDailyAppointmentsInput = {
  professionalId: string;
  establishmentId?: string;
  date: string;
};

export class ListProfessionalDailyAppointments {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentRepository)
  private readonly establishmentRepo: IEstablishmentRepository;
  @Inject(IProfessionalAppointmentRepository)
  private readonly appointmentRepo: IProfessionalAppointmentRepository;

  async execute(data: ListProfessionalDailyAppointmentsInput) {
    const professional = await this.professionalRepo.findById(
      data.professionalId,
    );

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    if (data.establishmentId) {
      const establishment = await this.establishmentRepo.findById(
        data.establishmentId,
      );

      if (!establishment) {
        throw new NotFoundException('Establishment not foun');
      }

      const isOwner = establishment.owner.id === professional.id;

      const isCollaborator = establishment.professionals
        .getItems()
        .some((ep) => ep.professional.id === professional.id);

      if (!isOwner && !isCollaborator) {
        throw new ForbiddenException('You do not belong to this establishment');
      }
    }

    return await this.appointmentRepo.getDailyAppointment({
      professionalId: professional.id,
      establishmentId: data.establishmentId,
      date: new Date(data.date),
    });
  }
}
