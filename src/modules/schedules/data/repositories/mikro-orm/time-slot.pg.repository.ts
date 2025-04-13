import { ITimeSlotRepository } from '@/schedules/application/repositories/time-slot.repository';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class TimeSlotPgRepository implements ITimeSlotRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async getTimeSlotById(id: string): Promise<TimeSlot | null> {
    return await this.entityManager.findOne(TimeSlot, { id });
  }
}
