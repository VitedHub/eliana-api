import { ScheduleModule } from '@/schedules/schedule.module';
import { Module } from '@nestjs/common';
import { ClientAppointmentController } from './api/controllers/client-appointment.controller';
import { GetAvailableDays } from './application/usecases/get-available-month-days.usecase';
import { IClientAppointmentRepository } from './application/repositories/client-appointment.repository';
import { ClientAppointmentPgRepository } from './data/repositories/mikro-orm/client-appointment.pg.repository';
import { GetAvailableDayTimeSlots } from './application/usecases/get-available-day-time-slots.usecase';
import { ListClientAppointments } from './application/usecases/list-client-appointmnets.usecase';
import { BookAppointment } from './application/usecases/book-appointment.usecase';
import { ClientsModule } from '@/clients/clients.module';
import { AuthModule } from '@/auth/auth.module';
import { EstablishmentsModule } from '@/establishments/establishments.module';
import { ListProfessionalMonthAppointmentDays } from './application/usecases/list-professional-month-appointment-days.usecase';
import { ProfessionalModule } from '@/professionals/professionals.module';
import { ProfessionalAppointmentsController } from './api/controllers/professional-appointments.controller';
import { ListProfessionalDailyAppointments } from './application/usecases/list-professional-daily-appointments.usecase';
import { ListEstablishmentMonthAppointments } from './application/usecases/list-establishment-month-appointments.usecase';
import { IProfessionalAppointmentRepository } from './application/repositories/professional-appointments.repository';
import { ProfessionalAppointmentPgRepository } from './data/repositories/mikro-orm/professional-appointments.pg.repository';
import { EstablishmentAppointmentPgRepository } from './data/repositories/mikro-orm/establishment-appointments.repository';
import { IEstablishmentAppointmentRepository } from './application/repositories/establishment-appointments.repository';
import { ListEstablishmentlDailyAppointments } from './application/usecases/list-establishment-daily-appointments.usecase';

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
      provide: IClientAppointmentRepository,
      useClass: ClientAppointmentPgRepository,
    },
    {
      provide: IProfessionalAppointmentRepository,
      useClass: ProfessionalAppointmentPgRepository,
    },
    {
      provide: IEstablishmentAppointmentRepository,
      useClass: EstablishmentAppointmentPgRepository,
    },
    GetAvailableDays,
    GetAvailableDayTimeSlots,
    ListClientAppointments,
    BookAppointment,
    ListProfessionalMonthAppointmentDays,
    ListProfessionalDailyAppointments,
    ListEstablishmentMonthAppointments,
    ListEstablishmentlDailyAppointments,
  ],
  exports: [
    ListEstablishmentMonthAppointments,
    ListEstablishmentlDailyAppointments,
  ],
  controllers: [
    ClientAppointmentController,
    ProfessionalAppointmentsController,
  ],
})
export class AppointmentModule {}
