import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';

export class ListAvailableTimeSlotsForClientPresenter {
  static toHTTP(data: TimeSlot) {
    return {
      id: data.id,
      starts: data.startTime,
      ends: data.endTime,
    };
  }
}
