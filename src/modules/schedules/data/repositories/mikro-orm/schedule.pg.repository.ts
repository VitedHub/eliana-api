import { Establishment } from '@/establishments/domain/entities/establishment.entity';
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

  async update(data: {
    id: string;
    isActive: boolean;
    establishment: Establishment;
  }): Promise<Schedule> {
    const schedule = await this.entityManager.findOneOrFail(Schedule, {
      id: data.id,
      establishment: data.establishment,
    });

    schedule.isActive = data.isActive;

    await this.entityManager.flush();

    return schedule;
  }
}
