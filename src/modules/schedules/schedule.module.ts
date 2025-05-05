import { forwardRef, Module } from '@nestjs/common';
import { IScheduleExceptionRepository } from './application/repositories/schedule-exception.repository';
import { ScheduleExceptionPgRepository } from './data/repositories/mikro-orm/schedule-exception.pg.repository';
import { IScheduleRepository } from './application/repositories/schedule.repository';
import { SchedulePgRepository } from './data/repositories/mikro-orm/schedule.pg.repository';
import { ProfessionalScheduleController } from './api/controllers/professional-schedules.controller';
import { AuthModule } from '@/auth/auth.module';
import { ProfessionalModule } from '@/professionals/professionals.module';
import { CreateProfessionalTimeSlot } from './application/usecases/create-time-slot.usecase';
import { ITimeSlotRepository } from './application/repositories/time-slot.repository';
import { TimeSlotPgRepository } from './data/repositories/mikro-orm/time-slot.pg.repository';
import { EstablishmentSchedulesController } from './api/controllers/establishment-schedules.controller';
import { ListAvailableDaysForClient } from './application/usecases/list-available-days-for-client.usecase';
import { EstablishmentsModule } from '@/establishments/establishments.module';
import { AppointmentModule } from '@/appointments/appointment.module';
import { ClientsModule } from '@/clients/clients.module';
import { ListAvailableTimeSlotsForClient } from './application/usecases/list-available-time-slots-for-client.usecase';

@Module({
  controllers: [
    ProfessionalScheduleController,
    EstablishmentSchedulesController,
  ],
  imports: [
    AuthModule,
    ProfessionalModule,
    ClientsModule,
    forwardRef(() => EstablishmentsModule),
    forwardRef(() => AppointmentModule),
  ],
  providers: [
    CreateProfessionalTimeSlot,
    ListAvailableDaysForClient,
    ListAvailableTimeSlotsForClient,
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
  exports: [
    IScheduleRepository,
    IScheduleExceptionRepository,
    ListAvailableTimeSlotsForClient,
  ],
})
export class ScheduleModule {}
