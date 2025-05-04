import { ScheduleException } from '@/schedules/domain/entities/schedule-exception.entity';

export abstract class IScheduleExceptionRepository {
  abstract getBlockedDates(
    data: GetBlockedDatesInput,
  ): Promise<ScheduleException[]>;
}

export interface GetBlockedDatesInput {
  establishmentId: string;
  professionalId: string;
  startDate: Date;
  endDate: Date;
}
