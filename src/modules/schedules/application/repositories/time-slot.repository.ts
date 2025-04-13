import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';

export abstract class ITimeSlotRepository {
  abstract getTimeSlotById(id: string): Promise<TimeSlot | null>;
}
