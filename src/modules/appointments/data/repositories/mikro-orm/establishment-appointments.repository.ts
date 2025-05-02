import {
  GetEstablishmentAppointmentsInRangeInput,
  GetEstablishmentDailyAppointmentIput,
  IEstablishmentAppointmentRepository,
} from '@/appointments/application/repositories/establishment-appointments.repository';
import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class EstablishmentAppointmentPgRepository
  implements IEstablishmentAppointmentRepository
{
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async getDailyAppointment(
    data: GetEstablishmentDailyAppointmentIput,
  ): Promise<Appointment[]> {
    return await this.entityManager.findAll(Appointment, {
      where: {
        establishment: data.establishmentId,
        date: data.date,
        ...(data.professionalId && { professional: data.professionalId }),
      },
      populate: ['client', 'timeSlot', 'establishment'],
      orderBy: { timeSlot: { startTime: 'ASC' } },
    });
  }

  async getAppointmentInRange(
    data: GetEstablishmentAppointmentsInRangeInput,
  ): Promise<Appointment[]> {
    return await this.entityManager.findAll(Appointment, {
      where: {
        establishment: data.establishmentId,
        date: {
          $gte: data.startDate,
          $lte: data.endDate,
        },
        ...(data.professionalId && { professional: data.professionalId }),
      },
      populate: ['timeSlot'],
    });
  }
}
