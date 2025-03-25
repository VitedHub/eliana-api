import { ScheduleModule } from '@/schedules/schedule.module';
import { Module } from '@nestjs/common';
import { ClientAppointmentController } from './api/controllers/client-appointment.controller';
import { GetAvailableDays } from './application/usecases/get-available-month-days.usecase';
import { IAppointmentRepository } from './application/repositories/appointment.repository';
import { AppointmentPgRepository } from './data/repositories/mikro-orm/appointment.pg.repository';
import { GetAvailableDayTimeSlots } from './application/usecases/get-available-day-time-slots.usecase';
import { ListClientAppointments } from './application/usecases/list-client-appointmnets.usecase';

@Module({
  imports: [ScheduleModule],
  controllers: [ClientAppointmentController],
  providers: [
    {
      provide: IAppointmentRepository,
      useClass: AppointmentPgRepository,
    },
    GetAvailableDays,
    GetAvailableDayTimeSlots,
    ListClientAppointments,
  ],
})
export class AppointmentModule {}
