import { ScheduleModule } from '@/schedules/schedule.module';
import { Module } from '@nestjs/common';
import { ClientAppointmentController } from './api/controllers/client-appointment.controller';
import { GetAvailableDays } from './application/usecases/get-available-days.usecase';
import { IAppointmentRepository } from './application/repositories/appointment.repository';
import { AppointmentPgRepository } from './data/repositories/mikro-orm/appointment.pg.repository';

@Module({
  imports: [ScheduleModule],
  controllers: [ClientAppointmentController],
  providers: [
    GetAvailableDays,
    {
      provide: IAppointmentRepository,
      useClass: AppointmentPgRepository,
    },
  ],
})
export class AppointmentModule {}
