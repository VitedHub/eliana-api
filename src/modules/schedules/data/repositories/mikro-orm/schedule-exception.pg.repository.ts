import { IScheduleExceptionRepository } from '@/schedules/application/repositories/schedule-exception.repository';
import { ScheduleException } from '@/schedules/domain/entities/schedule-exception.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class ScheduleExceptionPgRepository
  implements IScheduleExceptionRepository
{
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async getBlockedDates(data: {
    startDate: Date;
    endDate: Date;
  }): Promise<Pick<ScheduleException, 'exceptionDate'>[]> {
    return await this.entityManager.findAll(ScheduleException, {
      where: {
        exceptionDate: { $gte: data.startDate, $lte: data.endDate },
        isBlocked: true,
      },
      fields: ['exceptionDate'],
    });
  }
}
