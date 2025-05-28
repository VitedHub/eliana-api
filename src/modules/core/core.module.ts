import { Module } from '@nestjs/common';
import { IHttpClient } from './application/providers/http-client.provider';
import { AxiosHttpClient } from './infra/providers/axios-http-client.provider';
import { CookieSecurityService } from './application/services/cookie-security.service';

@Module({
  imports: [],
  providers: [
    {
      provide: IHttpClient,
      useClass: AxiosHttpClient,
    },
    CookieSecurityService,
  ],
  exports: [IHttpClient, CookieSecurityService],
})
export class CoreModule {}
