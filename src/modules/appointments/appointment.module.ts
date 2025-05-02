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
import { EstablishmentsModule } from '@/establishments/establishments.module';
import { ListProfessionalMonthAppointmentDays } from './application/usecases/list-professional-month-appointment-days.usecase';
import { ProfessionalModule } from '@/professionals/professionals.module';
import { ProfessionalAppointmentsController } from './api/controllers/professional-appointments.controller';

@Module({
  imports: [
    AuthModule,
    ScheduleModule,
    ClientsModule,
    EstablishmentsModule,
    ProfessionalModule,
  ],
  providers: [
    {
      provide: IAppointmentRepository,
      useClass: AppointmentPgRepository,
    },
    GetAvailableDays,
    GetAvailableDayTimeSlots,
    ListClientAppointments,
    BookAppointment,
    ListProfessionalMonthAppointmentDays,
  ],
  controllers: [
    ClientAppointmentController,
    AppointmentsController,
    ProfessionalAppointmentsController,
  ],
})
export class AppointmentModule {}
