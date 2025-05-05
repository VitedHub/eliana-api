import { Inject, NotFoundException } from '@nestjs/common';
import { IClientAppointmentRepository } from '../repositories/client-appointment.repository';
import { Appointment } from '@/appointments/domain/entities/appointment.entity';
import { IEstablishmentRepository } from '@/establishments/application/repositories/establishment.repository';
import { ListAvailableTimeSlotsForClient } from '@/schedules/application/usecases/list-available-time-slots-for-client.usecase';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { AppointmentBuilder } from '@/appointments/domain/builders/appointment.builder';
import { IClientRepository } from '@/clients/application/repositories/client.repository';

export type BookAppointmentInput = {
  clientId: string;
  timeSlotId: string;
  date: string;
  establishmentSlug: string;
  professionalId: string;
};

export type BookAppointmentOutput = Appointment;

export class BookAppointment {
  @Inject(IClientRepository)
  private clientRepo: IClientRepository;
  @Inject(IEstablishmentRepository)
  private establishmentRepo: IEstablishmentRepository;
  @Inject(IProfessionalRepository)
  protected profesionalRepo: IProfessionalRepository;
  @Inject(ListAvailableTimeSlotsForClient)
  private getAvailableDayTimeSlots: ListAvailableTimeSlotsForClient;
  @Inject(IClientAppointmentRepository)
  private appointmentRepo: IClientAppointmentRepository;

  async execute(data: BookAppointmentInput): Promise<BookAppointmentOutput> {
    const client = await this.clientRepo.findById(data.clientId);
    if (!client) {
      throw new NotFoundException('Client not found');
    }

    const establishment = await this.establishmentRepo.findByPublicURL(
      data.establishmentSlug,
    );

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

    const professional = await this.profesionalRepo.findById(
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
      throw new NotFoundException(
        'Profesisonal not belong to this establishment',
      );
    }

    const availableTimeSlots = await this.getAvailableDayTimeSlots.execute({
      date: data.date,
      professionalId: professional.id,
      slug: establishment.publicUrl,
    });

    const selectedTimeSlots = availableTimeSlots.find(
      (slot) => slot.id === data.timeSlotId,
    );

    if (!selectedTimeSlots) {
      throw new NotFoundException('Time slot not found or not available');
    }

    const appointment = AppointmentBuilder.create({
      establishment,
      professional,
      client,
      date: data.date,
      timeSlot: selectedTimeSlots,
    });

    return this.appointmentRepo.bookAppointment(appointment);
  }
}
