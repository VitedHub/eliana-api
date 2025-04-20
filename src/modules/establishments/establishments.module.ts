import { Module } from '@nestjs/common';
import { ProfessionalEstablishmentController } from './api/controllers/professional-establishment/professional-establishment.controller';
import { IEstablishmentRepository } from './application/repositories/establishment.repository';
import { EstablishmentPgRepository } from './data/repositories/mikro-orm/establishment.pg.repository';
import { CreateEstablishment } from './application/usecases/create-establishmet.usecase';
import { ProfessionalModule } from '@/professionals/professionals.module';
import { AddressesModule } from '@/addresses/addresses.module';
import { AuthModule } from '@/auth/auth.module';

@Module({
  imports: [AuthModule, ProfessionalModule, AddressesModule],
  providers: [
    CreateEstablishment,
    {
      provide: IEstablishmentRepository,
      useClass: EstablishmentPgRepository,
    },
  ],
  controllers: [ProfessionalEstablishmentController],
})
export class EstablishmentsModule {}
