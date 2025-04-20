import { IEstablishmentRepository } from '@/establishments/application/repositories/establishment.repository';
import { EstablishmentPgRepository } from '@/establishments/data/repositories/mikro-orm/establishment.pg.repository';
import { Module } from '@nestjs/common';
import { IsCepConstraint } from './api/validators/is-cep.validator';
import { CoreModule } from '@/core/core.module';

@Module({
  imports: [CoreModule],
  providers: [
    {
      provide: IEstablishmentRepository,
      useClass: EstablishmentPgRepository,
    },
    IsCepConstraint,
  ],
})
export class AddressesModule {}
