import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IAppointmentRepository } from '../repositories/appointment.repository';
import { lastDayOfMonth, parseISO, startOfMonth } from 'date-fns';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { IEstablishmentRepository } from '@/establishments/application/repositories/establishment.repository';

export type ListProfessionalMonthAppointmentDaysInptu = {
  professionalId: string;
  month: string;
  establishmentId?: string;
};

export class ListProfessionalMonthAppointmentDays {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentRepository)
  private readonly establishmentRepo: IEstablishmentRepository;
  @Inject(IAppointmentRepository)
  private readonly appointmentRepo: IAppointmentRepository;

  async execute(data: ListProfessionalMonthAppointmentDaysInptu) {
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
        throw new NotFoundException('Establishment not found');
      }

      const isOwner = establishment.owner.id === professional.id;

      const isCollaborator = establishment.professionals
        .getItems()
        .some((ep) => ep.professional.id === professional.id);

      if (!isOwner && !isCollaborator) {
        throw new ForbiddenException('You do not belong to this establishment');
      }
    }

    const startDate = startOfMonth(parseISO(`${data.month}-01`));
    const endDate = lastDayOfMonth(startDate);

    return await this.appointmentRepo.getProfessionalAppointmentInRange({
      professionalId: professional.id,
      establishmentId: data.establishmentId,
      startDate,
      endDate,
    });
  }
}
