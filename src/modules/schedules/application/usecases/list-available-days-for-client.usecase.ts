import { IEstablishmentRepository } from '@/establishments/application/repositories/establishment.repository';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  addDays,
  getDay,
  isBefore,
  isSameDay,
  lastDayOfMonth,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { IScheduleRepository } from '../repositories/schedule.repository';
import { IClientAppointmentRepository } from '@/appointments/application/repositories/client-appointment.repository';
import { IProfessionalRepository } from '@/professionals/application/repositories/professional.repository';
import { IScheduleExceptionRepository } from '../repositories/schedule-exception.repository';
import { dayOfWeekMap } from '@/schedules/domain/enums/day-of-week.enum';

export type ListAvailableDaysForClientInput = {
  month: string;
  slug: string;
  professionalId: string;
};

export class ListAvailableDaysForClient {
  @Inject(IEstablishmentRepository)
  private readonly establishmentRepo: IEstablishmentRepository;
  @Inject(IProfessionalRepository)
  private readonly professionalRepo: IProfessionalRepository;
  @Inject(IScheduleRepository)
  private readonly scheduleRepo: IScheduleRepository;
  @Inject(IClientAppointmentRepository)
  private readonly appointmentRepo: IClientAppointmentRepository;
  @Inject(IScheduleExceptionRepository)
  private readonly scheduleExceptionRepo: IScheduleExceptionRepository;

  async execute(data: ListAvailableDaysForClientInput) {
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

    const startDate = startOfMonth(parseISO(`${data.month}-01`));
    const endDate = lastDayOfMonth(startDate);
    const today = new Date();

    const schedules = await this.scheduleRepo.getAvailableDays(
      establishment.id,
    );

    const appointments = await this.appointmentRepo.getBookedDates({
      establishmentId: establishment.id,
      professionalId: professional.id,
      startDate,
      endDate,
    });

    const scheduleExceptions = await this.scheduleExceptionRepo.getBlockedDates(
      {
        establishmentId: establishment.id,
        professionalId: professional.id,
        startDate,
        endDate,
      },
    );

    const normalizeDate = (date: Date) => date.toISOString().split('T')[0];

    const bookedByDay = appointments.reduce(
      (map, appointment) => {
        const dateString = normalizeDate(appointment.date);
        if (!map[dateString]) map[dateString] = new Set<string>();
        map[dateString].add(appointment.timeSlot.id);
        return map;
      },
      {} as Record<string, Set<string>>,
    );

    const availableDates: string[] = [];

    for (let day = startDate; day <= endDate; day = addDays(day, 1)) {
      if (isBefore(day, today)) continue;

      const weekDay = dayOfWeekMap[getDay(day)];

      const daySchedules = schedules.filter((s) => s.dayOfWeek === weekDay);
      if (daySchedules.length === 0) continue;

      const isBlocked = scheduleExceptions.some((exception) =>
        isSameDay(exception.exceptionDate, day),
      );
      if (isBlocked) continue;

      const hasAvailableSlot = daySchedules.some((schedule) =>
        schedule.timeSlot.getItems().some((slot) => {
          if (slot.professional.id !== professional.id) return false;

          const bookedSlots = bookedByDay[normalizeDate(day)];
          return !(bookedSlots && bookedSlots.has(slot.id));
        }),
      );

      if (hasAvailableSlot) {
        availableDates.push(normalizeDate(day));
      }
    }

    return availableDates;
  }
}
