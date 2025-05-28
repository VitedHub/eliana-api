import { forwardRef, Module } from '@nestjs/common';
import { ProfessionalEstablishmentController } from './api/controllers/establishment/establishment.controller';
import { IEstablishmentRepository } from './application/repositories/establishment.repository';
import { EstablishmentPgRepository } from './data/repositories/mikro-orm/establishment.pg.repository';
import { CreateEstablishment } from './application/usecases/create-establishmet.usecase';
import { ProfessionalModule } from '@/professionals/professionals.module';
import { AddressesModule } from '@/addresses/addresses.module';
import { AuthModule } from '@/auth/auth.module';
import { ListEstablishments } from './application/usecases/list-establishments.usecase';
import { DetailEstablishment } from './application/usecases/detail-establishment.usecase';
import { ListEstablishmentProfessionals } from './application/usecases/list-establishment-professionals.usecase';
import { UpdateEstablishmentSchedule } from './application/usecases/update-establishment-schedule.usecase';
import { ScheduleModule } from '@/schedules/schedule.module';
import { IEstablishmentProfessionalRepository } from './application/repositories/establishment-professional.repository';
import { EstablishmentProfessionaPgRepository } from './data/repositories/mikro-orm/establishment-professional.pg.repository';
import { AppointmentModule } from '@/appointments/appointment.module';
import { SubscriptionModule } from '@/subscriptions/subscription.module';

@Module({
  imports: [
    AuthModule,
    ProfessionalModule,
    AddressesModule,
    forwardRef(() => ScheduleModule),
    forwardRef(() => AppointmentModule),
    SubscriptionModule,
  ],
  providers: [
    CreateEstablishment,
    ListEstablishments,
    DetailEstablishment,
    ListEstablishmentProfessionals,
    UpdateEstablishmentSchedule,
    {
      provide: IEstablishmentRepository,
      useClass: EstablishmentPgRepository,
    },
    {
      provide: IEstablishmentProfessionalRepository,
      useClass: EstablishmentProfessionaPgRepository,
    },
  ],
  exports: [IEstablishmentRepository, IEstablishmentProfessionalRepository],
  controllers: [ProfessionalEstablishmentController],
})
export class EstablishmentsModule {}
