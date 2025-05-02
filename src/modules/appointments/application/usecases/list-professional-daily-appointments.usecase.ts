import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IAppointmentRepository } from '../repositories/appointment.repository';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { IEstablishmentProfessionalRepository } from '@/establishments/application/repositories/establishment-professional.repository';

export type ListProfessionalDailyAppointmentsInput = {
  professionalId: string;
  establishmentId?: string;
  date: string;
};

export class ListProfessionalDailyAppointments {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentProfessionalRepository)
  private readonly establishmentProfessionalRepo: IEstablishmentProfessionalRepository;
  @Inject(IAppointmentRepository)
  private readonly appointmentRepo: IAppointmentRepository;

  async execute(data: ListProfessionalDailyAppointmentsInput) {
    const professional = await this.professionalRepo.findById(
      data.professionalId,
    );

    if (!professional) {
      throw new NotFoundException('Professional not found');
    }

    if (data.establishmentId) {
      const hasProfessionalEstablishment =
        await this.establishmentProfessionalRepo.exists({
          establishmentId: data.establishmentId,
          professionalId: professional.id,
        });

      if (!hasProfessionalEstablishment) {
        throw new ForbiddenException('You do not belong to this establishment');
      }
    }

    return await this.appointmentRepo.getProfessionalDailyAppointment({
      professionalId: professional.id,
      establishmentId: data.establishmentId,
      date: new Date(data.date),
    });
  }
}
