import { IAppointmentRepository } from '@/appointments/application/repositories/appointment.repository';
import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { APPOINTMENT_STATUS } from '@/appointments/domain/enums/appointment-status.enum';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class AppointmentPgRepository implements IAppointmentRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async listClientAppointments(data: {
    clientId: string;
  }): Promise<Appointment[]> {
    return await this.entityManager.findAll(Appointment, {
      where: {
        client: data.clientId,
      },
      populate: ['timeSlot', 'timeSlot.schedule'],
    });
  }

  async getBookedDates(data: {
    startDate: Date;
    endDate: Date;
  }): Promise<Pick<Appointment, 'date' | 'timeSlot'>[]> {
    return await this.entityManager.findAll(Appointment, {
      where: {
        date: { $gte: data.startDate, $lte: data.endDate },
        status: APPOINTMENT_STATUS.SCHEDULED,
      },
      fields: ['date', 'timeSlot'],
    });
  }
}
