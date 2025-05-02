import { Inject } from '@nestjs/common';
import { IClientAppointmentRepository } from '../repositories/client-appointment.repository';
import { IScheduleExceptionRepository } from '@/schedules/application/repositories/schedule-exception.repository';
import { IScheduleRepository } from '@/schedules/application/repositories/schedule.repository';
import {
  addDays,
  getDay,
  isBefore,
  isSameDay,
  lastDayOfMonth,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { dayOfWeekMap } from '@/schedules/domain/enums/day-of-week.enum';

export type GetAvailableDaysInput = {
  month: string;
};

export class GetAvailableDays {
  @Inject(IScheduleRepository)
  private scheduleRepo: IScheduleRepository;
  @Inject(IScheduleExceptionRepository)
  private ScheduleExceptionRepo: IScheduleExceptionRepository;
  @Inject(IClientAppointmentRepository)
  private appointmentRepo: IClientAppointmentRepository;

  async execute(data: GetAvailableDaysInput) {
    const startMonthDate = startOfMonth(parseISO(`${data.month}-01`));
    const endMonthDate = lastDayOfMonth(startMonthDate);
    const today = new Date();

    const schedules = await this.scheduleRepo.getAvailableWeekDays();

    const appointments = await this.appointmentRepo.getBookedDates({
      startDate: startMonthDate,
      endDate: endMonthDate,
    });

    const scheduleExceptions = await this.ScheduleExceptionRepo.getBlockedDates(
      {
        startDate: startMonthDate,
        endDate: endMonthDate,
      },
    );

    const availableDates = [];

    for (let day = startMonthDate; day <= endMonthDate; day = addDays(day, 1)) {
      if (isBefore(day, today)) continue;

      const weekDayString = dayOfWeekMap[getDay(day)];

      const daySchedules = schedules.filter(
        (schedule) => schedule.dayOfWeek === weekDayString,
      );

      if (daySchedules.length === 0) continue;

      const hasAvailableTimeSlot = daySchedules.some(
        (schedule) => schedule.timeSlot.length > 0,
      );

      if (!hasAvailableTimeSlot) continue;

      const normalizeDate = (date: Date) => date.toISOString().split('T')[0];

      const isDayBlocked = scheduleExceptions.some((exception) => {
        return isSameDay(
          normalizeDate(exception.exceptionDate),
          normalizeDate(day),
        );
      });

      if (isDayBlocked) continue;

      const bookedAppointments = appointments.reduce(
        (map, appointment) => {
          const dateString = normalizeDate(appointment.date);

          if (!map[dateString]) map[dateString] = new Set<string>();

          map[dateString].add(appointment.timeSlot.id);

          return map;
        },
        {} as Record<string, Set<string>>,
      );

      const availableTimeSlot = daySchedules.some((schedule) =>
        schedule.timeSlot.getItems().some((slot) => {
          const bookedForDay = bookedAppointments[normalizeDate(day)];
          return !(bookedForDay && bookedForDay.has(slot.id));
        }),
      );

      if (!availableTimeSlot) continue;

      availableDates.push(normalizeDate(day));
    }

    return availableDates;
  }
}
