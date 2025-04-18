import { Module } from '@nestjs/common';
import { IProfessionalRepository } from './application/repositories/professional.repository';
import { ProfessionalPgRepository } from './data/repositories/mikro-orm/professional.pg.repository';

@Module({
  providers: [
    {
      provide: IProfessionalRepository,
      useClass: ProfessionalPgRepository,
    },
  ],
  exports: [IProfessionalRepository],
})
export class ProfessionalModule {}
