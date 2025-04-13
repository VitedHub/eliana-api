import { IScheduleExceptionRepository } from '@/schedules/application/repositories/schedule-exception.repository';
import { IAppointmentRepository } from '../repositories/appointment.repository';
import { IScheduleRepository } from '@/schedules/application/repositories/schedule.repository';
import { Inject } from '@nestjs/common';
import { getDay, isSameDay } from 'date-fns';
import { dayOfWeekMap } from '@/schedules/domain/enums/day-of-week.enum';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';

export type GetAvailableDayTimeSlotsInput = {
  date: Date;
};

export class GetAvailableDayTimeSlots {
  @Inject(IScheduleRepository)
  private scheduleRepo: IScheduleRepository;
  @Inject(IScheduleExceptionRepository)
  private ScheduleExceptionRepo: IScheduleExceptionRepository;
  @Inject(IAppointmentRepository)
  private appointmentRepo: IAppointmentRepository;

  async execute(data: GetAvailableDayTimeSlotsInput) {
    const availableTimeSlot: TimeSlot[] = [];
    const day = data.date;
    const weekDayString = dayOfWeekMap[getDay(day)];

    const normalizeDate = (date: Date) => date.toISOString().split('T')[0];

    const schedules = await this.scheduleRepo.getAvailableWeekDays();

    const daySchedules = schedules.filter(
      (schedule) => schedule.dayOfWeek === weekDayString,
    );

    if (daySchedules.length === 0) return availableTimeSlot;

    const appointments = await this.appointmentRepo.getBookedDates({
      startDate: day,
      endDate: day,
    });

    const scheduleExceptions = await this.ScheduleExceptionRepo.getBlockedDates(
      {
        startDate: day,
        endDate: day,
      },
    );

    const isDayBlocked = scheduleExceptions.some((exception) => {
      return isSameDay(
        normalizeDate(exception.exceptionDate),
        normalizeDate(day),
      );
    });

    if (isDayBlocked) return availableTimeSlot;

    const bookedAppointments = appointments.reduce(
      (map, appointment) => {
        const dateString = normalizeDate(appointment.date);

        if (!map[dateString]) map[dateString] = new Set<string>();

        map[dateString].add(appointment.timeSlot.id);

        return map;
      },
      {} as Record<string, Set<string>>,
    );

    daySchedules.map((schedule) => {
      for (const slot of schedule.timeSlot) {
        const bookedForDay = bookedAppointments[day.toString()];

        if (!(bookedForDay && bookedForDay.has(slot.id)))
          availableTimeSlot.push(slot);
      }
    });

    return availableTimeSlot;
  }
}
