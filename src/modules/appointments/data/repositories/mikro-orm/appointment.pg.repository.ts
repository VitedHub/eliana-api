import {
  BookAppointmentInput,
  IAppointmentRepository,
} from '@/appointments/application/repositories/appointment.repository';
import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { APPOINTMENT_STATUS } from '@/appointments/domain/enums/appointment-status.enum';
import { EntityManager, LockMode } from '@mikro-orm/postgresql';
import { ConflictException, Inject } from '@nestjs/common';

export class AppointmentPgRepository implements IAppointmentRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async bookAppointment(data: BookAppointmentInput): Promise<Appointment> {
    return this.entityManager.transactional(async (tx) => {
      const existingAppointment = await tx.findOne(
        Appointment,
        {
          date: data.date,
          timeSlot: data.timeSlot,
          client: data.client,
        },
        {
          lockMode: LockMode.PESSIMISTIC_WRITE,
        },
      );

      if (existingAppointment) {
        throw new ConflictException('Appointment already booked');
      }

      const appointment = tx.create(Appointment, {
        id: data.appointmentId,
        date: data.date,
        timeSlot: data.timeSlot,
        client: data.client,
        status: data.status,
      });

      await tx.persistAndFlush(appointment);
      return appointment;
    });
  }

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
