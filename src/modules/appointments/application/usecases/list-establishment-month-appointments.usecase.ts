import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import {
  ForbiddenException,
  Inject,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IEstablishmentRepository } from '../../../establishments/application/repositories/establishment.repository';
import { lastDayOfMonth, parseISO, startOfMonth } from 'date-fns';
import { IEstablishmentAppointmentRepository } from '../repositories/establishment-appointments.repository';

export type ListEstablishmentMonthAppointmentsInput = {
  requesterId: string;
  establishmentId: string;
  month: string;
  professionalId?: string;
};

export class ListEstablishmentMonthAppointments {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentRepository)
  private readonly establishmentRepo: IEstablishmentRepository;
  @Inject(IEstablishmentAppointmentRepository)
  private readonly appointmentRepo: IEstablishmentAppointmentRepository;

  async execute(data: ListEstablishmentMonthAppointmentsInput) {
    const requester = await this.professionalRepo.findById(data.requesterId);
    if (!requester) throw new UnauthorizedException('Requester not found');

    const establishment = await this.establishmentRepo.findById(
      data.establishmentId,
    );
    if (!establishment) throw new NotFoundException('Establishment not found');

    if (establishment.owner.id !== requester.id) {
      throw new ForbiddenException('Only the owner can access this data');
    }

    if (data.professionalId) {
      const professional = await this.professionalRepo.findById(
        data.professionalId,
      );

      if (!professional) {
        throw new NotFoundException('Professional not found');
      }

      const isOwner = establishment.owner.id === professional.id;
      const isCollaborator = establishment.professionals
        .getItems()
        .some((ep) => ep.professional.id === professional.id);

      if (!isOwner && !isCollaborator) {
        throw new ForbiddenException(
          'This professional does not belong to this establishment',
        );
      }
    }

    const startDate = startOfMonth(parseISO(`${data.month}-01`));
    const endDate = lastDayOfMonth(startDate);

    return await this.appointmentRepo.getAppointmentInRange({
      establishmentId: establishment.id,
      professionalId: data.professionalId,
      startDate,
      endDate,
    });
  }
}
