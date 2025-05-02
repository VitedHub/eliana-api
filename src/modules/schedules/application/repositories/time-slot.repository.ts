import { Professional } from '@/professionals/domain/entities/professionals.entity';
import { Schedule } from '@/schedules/domain/entities/schedule.entity';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';

export abstract class ITimeSlotRepository {
  abstract create(data: TimeSlot): Promise<TimeSlot>;
  abstract getTimeSlotById(id: string): Promise<TimeSlot | null>;
  abstract hasOverlappingTimeSlot(
    data: HasOverlappingTimeSlotInput,
  ): Promise<boolean>;
}

export type HasOverlappingTimeSlotInput = {
  professional: Professional;
  schedule: Schedule;
  startTime: string;
  endTime: string;
};
