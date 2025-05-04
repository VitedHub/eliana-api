import {
  GetBlockedDatesInput,
  IScheduleExceptionRepository,
} from '@/schedules/application/repositories/schedule-exception.repository';
import { ScheduleException } from '@/schedules/domain/entities/schedule-exception.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export class ScheduleExceptionPgRepository
  implements IScheduleExceptionRepository
{
  @Inject(EntityManager)
  private readonly entityManager: EntityManager;

  async getBlockedDates(
    data: GetBlockedDatesInput,
  ): Promise<ScheduleException[]> {
    return await this.entityManager.findAll(ScheduleException, {
      where: {
        professional: data.professionalId,
        establishment: data.establishmentId,
        exceptionDate: { $gte: data.startDate, $lte: data.endDate },
        isBlocked: true,
      },
    });
  }
}
