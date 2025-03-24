import { Schedule } from '@/schedules/domain/entities/schedule.entity';

export abstract class IScheduleRepository {
  abstract getAvailableWeekDays(): Promise<
    Pick<Schedule, 'id' | 'dayOfWeek' | 'timeSlot'>[]
  >;
}
