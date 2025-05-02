import { ForbiddenException, Inject, NotFoundException } from '@nestjs/common';
import { IAppointmentRepository } from '../repositories/appointment.repository';
import { lastDayOfMonth, parseISO, startOfMonth } from 'date-fns';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { IEstablishmentProfessionalRepository } from '@/establishments/application/repositories/establishment-professional.repository';

export type ListProfessionalMonthAppointmentDaysInptu = {
  professionalId: string;
  month: string;
  establishmentId?: string;
};

export class ListProfessionalMonthAppointmentDays {
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IEstablishmentProfessionalRepository)
  private readonly establishmentProfessionalRepo: IEstablishmentProfessionalRepository;
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
      const hasProfessionalEstablishment =
        await this.establishmentProfessionalRepo.exists({
          establishmentId: data.establishmentId,
          professionalId: professional.id,
        });

      if (!hasProfessionalEstablishment) {
        throw new ForbiddenException('You do not belong to this establishment');
      }
    }

    const startDate = startOfMonth(parseISO(`${data.month}-01`));
    const endDate = lastDayOfMonth(startDate);

    const appointments =
      await this.appointmentRepo.listProfessionalAppointmentInRange({
        professionalId: professional.id,
        establishmentId: data.establishmentId,
        startDate,
        endDate,
      });

    const normalizeDate = (date: Date) => date.toISOString().split('T')[0];

    const uniqueDays = Array.from(
      new Set(
        appointments.map((appointment) => normalizeDate(appointment.date)),
      ),
    );

    return uniqueDays;
  }
}
