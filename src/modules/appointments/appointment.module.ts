import { ScheduleModule } from '@/schedules/schedule.module';
import { Module } from '@nestjs/common';
import { ClientAppointmentController } from './api/controllers/client-appointment.controller';
import { GetAvailableDays } from './application/usecases/get-available-month-days.usecase';
import { IAppointmentRepository } from './application/repositories/appointment.repository';
import { AppointmentPgRepository } from './data/repositories/mikro-orm/appointment.pg.repository';
import { GetAvailableDayTimeSlots } from './application/usecases/get-available-day-time-slots.usecase';
import { ListClientAppointments } from './application/usecases/list-client-appointmnets.usecase';
import { BookAppointment } from './application/usecases/book-appointment.usecase';
import { ClientsModule } from '@/clients/clients.module';
import { AppointmentsController } from './api/controllers/appointments.controller';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [AuthModule, ScheduleModule, ClientsModule],
  controllers: [ClientAppointmentController, AppointmentsController],
  providers: [
    {
      provide: IAppointmentRepository,
      useClass: AppointmentPgRepository,
    },
    GetAvailableDays,
    GetAvailableDayTimeSlots,
    ListClientAppointments,
    BookAppointment,
  ],
})
export class AppointmentModule {}
