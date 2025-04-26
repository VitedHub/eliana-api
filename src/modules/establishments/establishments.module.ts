import { Module } from '@nestjs/common';
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

@Module({
  imports: [AuthModule, ProfessionalModule, AddressesModule],
  providers: [
    CreateEstablishment,
    ListEstablishments,
    DetailEstablishment,
    ListEstablishmentProfessionals,
    {
      provide: IEstablishmentRepository,
      useClass: EstablishmentPgRepository,
    },
  ],
  controllers: [ProfessionalEstablishmentController],
})
export class EstablishmentsModule {}
