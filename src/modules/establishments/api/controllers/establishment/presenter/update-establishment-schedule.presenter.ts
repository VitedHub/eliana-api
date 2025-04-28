import { Schedule } from '@/schedules/domain/entities/schedule.entity';

export class UpdateEstablishmentSchedulePresenter {
  static toHTTP(data: Schedule) {
    const day = data.dayOfWeek.toLowerCase();

    return {
      message: `Successfully updated ${day}'s schedule.`,
    };
  }
}
