import { Module } from '@nestjs/common';
import { IClientRepository } from './application/repositories/client.repository';
import { ClientPgRepository } from './data/repositories/mikro-orm/client.pg.repository';

@Module({
  providers: [
    {
      provide: IClientRepository,
      useClass: ClientPgRepository,
    },
  ],
  exports: [IClientRepository],
})
export class ClientsModule {}
