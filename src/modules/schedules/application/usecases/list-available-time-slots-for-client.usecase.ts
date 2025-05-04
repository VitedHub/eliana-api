import { IEstablishmentRepository } from '@/establishments/application/repositories/establishment.repository';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { dayOfWeekMap } from '@/schedules/domain/enums/day-of-week.enum';
import { Inject, NotFoundException } from '@nestjs/common';
import { getDay, isSameDay, parseISO } from 'date-fns';
import { IScheduleRepository } from '../repositories/schedule.repository';
import { IScheduleExceptionRepository } from '../repositories/schedule-exception.repository';
import { IClientAppointmentRepository } from '@/appointments/application/repositories/client-appointment.repository';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';

export type ListAvailableTimeSlotsForClientInput = {
  slug: string;
  date: string;
  professionalId: string;
};

export class ListAvailableTimeSlotsForClient {
  @Inject(IEstablishmentRepository)
  private readonly establishmentRepo: IEstablishmentRepository;
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IScheduleRepository)
  private readonly scheduleRepo: IScheduleRepository;
  @Inject(IScheduleExceptionRepository)
  private readonly scheduleExceptionRepo: IScheduleExceptionRepository;
  @Inject(IClientAppointmentRepository)
  private readonly appointmentRepo: IClientAppointmentRepository;

  async execute(data: ListAvailableTimeSlotsForClientInput) {
    const establishment = await this.establishmentRepo.findByPublicURL(
      data.slug,
    );

    if (!establishment) {
      throw new NotFoundException('Establishment not found');
    }

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
      throw new NotFoundException(
        'Profesisonal not belong to this establishment',
      );
    }

    const targetDate = parseISO(data.date);

    const weekDay = dayOfWeekMap[getDay(targetDate)];

    const schedules = await this.scheduleRepo.getAvailableDays(
      establishment.id,
    );
    const daySchedules = schedules.filter(
      (schedule) => schedule.dayOfWeek === weekDay,
    );
    if (daySchedules.length === 0) return [];

    const scheduleExceptions = await this.scheduleExceptionRepo.getBlockedDates(
      {
        establishmentId: establishment.id,
        professionalId: professional.id,
        startDate: targetDate,
        endDate: targetDate,
      },
    );

    const isBlocked = scheduleExceptions.some((exception) =>
      isSameDay(exception.exceptionDate, targetDate),
    );
    if (isBlocked) return [];

    const appointments = await this.appointmentRepo.getBookedDates({
      startDate: targetDate,
      endDate: targetDate,
      establishmentId: establishment.id,
      professionalId: professional.id,
    });

    const bookedSlots = appointments.reduce((set, appt) => {
      set.add(appt.timeSlot.id);
      return set;
    }, new Set<string>());

    const availableSlots: TimeSlot[] = [];

    for (const schedule of daySchedules) {
      for (const slot of schedule.timeSlot.getItems()) {
        if (slot.professional.id !== professional.id) continue;
        if (!bookedSlots.has(slot.id)) {
          availableSlots.push(slot);
        }
      }
    }

    return availableSlots;
  }
}
