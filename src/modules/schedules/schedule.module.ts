import { Module } from '@nestjs/common';
import { IScheduleExceptionRepository } from './application/repositories/schedule-exception.repository';
import { ScheduleExceptionPgRepository } from './data/repositories/mikro-orm/schedule-exception.pg.repository';
import { IScheduleRepository } from './application/repositories/schedule.repository';
import { SchedulePgRepository } from './data/repositories/mikro-orm/schedule.pg.repository';

@Module({
  controllers: [],
  providers: [
    {
      provide: IScheduleExceptionRepository,
      useClass: ScheduleExceptionPgRepository,
    },
    {
      provide: IScheduleRepository,
      useClass: SchedulePgRepository,
    },
  ],
  exports: [IScheduleRepository, IScheduleExceptionRepository],
})
export class ScheduleModule {}
