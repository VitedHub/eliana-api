import {
  HasOverlappingTimeSlotInput,
  ITimeSlotRepository,
} from '@/schedules/application/repositories/time-slot.repository';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class TimeSlotPgRepository implements ITimeSlotRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async create(data: TimeSlot): Promise<TimeSlot> {
    const timeSlot = this.entityManager.create(TimeSlot, data);
    await this.entityManager.persistAndFlush(timeSlot);
    return timeSlot;
  }

  async getTimeSlotById(id: string): Promise<TimeSlot | null> {
    return await this.entityManager.findOne(TimeSlot, { id });
  }

  async hasOverlappingTimeSlot(
    data: HasOverlappingTimeSlotInput,
  ): Promise<boolean> {
    const timeSlot = await this.entityManager.find(TimeSlot, {
      professional: data.professional,
      schedule: data.schedule,
      $and: [
        { startTime: { $lt: data.endTime } },
        { endTime: { $gt: data.startTime } },
      ],
    });

    return timeSlot.length > 0;
  }
}
