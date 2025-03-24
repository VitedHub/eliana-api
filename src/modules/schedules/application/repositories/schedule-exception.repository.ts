import { ScheduleException } from '@/schedules/domain/entities/schedule-exception.entity';

export abstract class IScheduleExceptionRepository {
  abstract getBlockedDates(data: {
    startDate: Date;
    endDate: Date;
  }): Promise<Pick<ScheduleException, 'exceptionDate'>[]>;
}
