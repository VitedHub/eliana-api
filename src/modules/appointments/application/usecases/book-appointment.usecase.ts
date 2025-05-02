import { Inject, NotFoundException } from '@nestjs/common';
import { IClientAppointmentRepository } from '../repositories/client-appointment.repository';
import { IClientRepository } from '@/clients/application/repositories/client.repository';
import { GetAvailableDayTimeSlots } from './get-available-day-time-slots.usecase';
import { APPOINTMENT_STATUS } from '@/appointments/domain/enums/appointment-status.enum';
import { randomUUID } from 'crypto';
import { Appointment } from '@/appointments/domain/entities/appointment.entity';

export type BookAppointmentInput = {
  clientId: string;
  timeSlotId: string;
  date: Date;
};

export type BookAppointmentOutput = Appointment;

export class BookAppointment {
  @Inject(IClientRepository)
  private clientRepo: IClientRepository;
  @Inject(GetAvailableDayTimeSlots)
  private getAvailableDayTimeSlots: GetAvailableDayTimeSlots;
  @Inject(IClientAppointmentRepository)
  private appointmentRepo: IClientAppointmentRepository;

  async execute(data: BookAppointmentInput): Promise<BookAppointmentOutput> {
    const client = await this.clientRepo.findById(data.clientId);

    if (!client) throw new NotFoundException('Client not found');

    const dayTimeSlot = await this.getAvailableDayTimeSlots.execute({
      date: data.date,
    });

    const timeSlot = dayTimeSlot.filter((timeSlot) => {
      return timeSlot.id === data.timeSlotId;
    })[0];

    if (!timeSlot) {
      throw new NotFoundException('Time slot not found or not available');
    }

    return await this.appointmentRepo.bookAppointment({
      appointmentId: randomUUID(),
      client,
      date: data.date,
      timeSlot: timeSlot,
      status: APPOINTMENT_STATUS.SCHEDULED,
    });
  }
}
