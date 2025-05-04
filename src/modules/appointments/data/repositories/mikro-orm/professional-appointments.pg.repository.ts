import {
  GetProfessionalAppointmentsInRangeInput,
  GetProfessionalDailyAppointmentIput,
} from '@/appointments/application/repositories/professional-appointments.repository';
import { IProfessionalAppointmentRepository } from '@/appointments/application/repositories/professional-appointments.repository';
import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class ProfessionalAppointmentPgRepository
  implements IProfessionalAppointmentRepository
{
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async getDailyAppointment(
    data: GetProfessionalDailyAppointmentIput,
  ): Promise<Appointment[]> {
    return await this.entityManager.findAll(Appointment, {
      where: {
        professional: data.professionalId,
        date: data.date,
        ...(data.establishmentId && { establishment: data.establishmentId }),
      },
      populate: ['client', 'timeSlot', 'establishment'],
      orderBy: { timeSlot: { startTime: 'ASC' } },
    });
  }

  async getAppointmentInRange(
    data: GetProfessionalAppointmentsInRangeInput,
  ): Promise<Appointment[]> {
    return await this.entityManager.findAll(Appointment, {
      where: {
        professional: data.professionalId,
        date: {
          $gte: data.startDate,
          $lte: data.endDate,
        },
        ...(data.establishmentId && { establishment: data.establishmentId }),
      },
      populate: ['timeSlot'],
    });
  }
}
