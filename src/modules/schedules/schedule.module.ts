import { Module } from '@nestjs/common';
import { IScheduleExceptionRepository } from './application/repositories/schedule-exception.repository';
import { ScheduleExceptionPgRepository } from './data/repositories/mikro-orm/schedule-exception.pg.repository';
import { IScheduleRepository } from './application/repositories/schedule.repository';
import { SchedulePgRepository } from './data/repositories/mikro-orm/schedule.pg.repository';
import { ScheduleController } from './api/controllers/schedules.controller';
import { AuthModule } from '@/auth/auth.module';
import { ProfessionalModule } from '@/professionals/professionals.module';
import { CreateTimeSlot } from './application/usecases/create-time-slot.usecase';
import { ITimeSlotRepository } from './application/repositories/time-slot.repository';
import { TimeSlotPgRepository } from './data/repositories/mikro-orm/time-slot.pg.repository';

@Module({
  controllers: [ScheduleController],
  imports: [AuthModule, ProfessionalModule],
  providers: [
    CreateTimeSlot,
    {
      provide: IScheduleExceptionRepository,
      useClass: ScheduleExceptionPgRepository,
    },
    {
      provide: IScheduleRepository,
      useClass: SchedulePgRepository,
    },
    {
      provide: ITimeSlotRepository,
      useClass: TimeSlotPgRepository,
    },
  ],
  exports: [IScheduleRepository, IScheduleExceptionRepository],
})
export class ScheduleModule {}
