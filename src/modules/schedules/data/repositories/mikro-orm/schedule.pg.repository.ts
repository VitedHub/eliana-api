import { IScheduleRepository } from '@/schedules/application/repositories/schedule.repository';
import { Schedule } from '@/schedules/domain/entities/schedule.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class SchedulePgRepository implements IScheduleRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async getScheduleById(id: string): Promise<Schedule | null> {
    return await this.entityManager.findOne(Schedule, { id });
  }

  async getAvailableWeekDays(): Promise<
    Pick<Schedule, 'id' | 'dayOfWeek' | 'timeSlot'>[]
  > {
    return await this.entityManager.find(
      Schedule,
      {
        isActive: true,
      },
      {
        populate: ['timeSlot'],
        fields: ['id', 'dayOfWeek'],
      },
    );
  }
}
