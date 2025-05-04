import { Establishment } from '@/establishments/domain/entities/establishment.entity';
import { IScheduleRepository } from '@/schedules/application/repositories/schedule.repository';
import { Schedule } from '@/schedules/domain/entities/schedule.entity';
import { TimeSlot } from '@/schedules/domain/entities/time-slot.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class SchedulePgRepository implements IScheduleRepository {
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async getScheduleById(id: string): Promise<Schedule | null> {
    return await this.entityManager.findOne(
      Schedule,
      { id },
      { populate: ['establishment'] },
    );
  }

  async getAvailableDays(establishmentId: string): Promise<Schedule[]> {
    return await this.entityManager.find(
      Schedule,
      {
        establishment: establishmentId,
        isActive: true,
      },
      {
        populate: ['timeSlot'],
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

    if (!data.isActive) {
      const timeSlots = await this.entityManager.find(TimeSlot, {
        schedule: { id: schedule.id },
      });

      for (const ts of timeSlots) {
        this.entityManager.remove(ts);
      }
    }

    await this.entityManager.flush();

    return schedule;
  }
}
