import { Module } from '@nestjs/common';
import { IClientRepository } from './application/repositories/client.repository';
import { ClientPgRepository } from './data/repositories/mikro-orm/client.pg.repository';
import { CookieSecurityService } from '@/core/application/services/cookie-security.service';

@Module({
  providers: [
    {
      provide: IClientRepository,
      useClass: ClientPgRepository,
    },
    CookieSecurityService,
  ],
  exports: [IClientRepository],
})
export class ClientsModule {}
